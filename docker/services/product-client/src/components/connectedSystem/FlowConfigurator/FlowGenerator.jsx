import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid } from '@material-ui/core';
import {
    // useNodesState,
    useEdgesState,
    MarkerType
    // Controls,
    // Background,
    // ControlButton,
    // addEdge,
    // applyEdgeChanges,
    // applyNodeChanges
} from 'reactflow';
import CustomSwitch from 'components/dynamic-form/inputFields/CustomSwitch';
import SimpleSelect from 'components/dynamic-form/inputFields/select';
// import { ReactComponent as NodeIcon } from 'assets/img/nodeIcon.svg';
// import FloatingEdge from './FloatingEdge';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
// import { saveDecisionFlow, getDecisionFlow } from 'services/connSystemJson/decision_flow.js';
import {
    getConnectedSystems,
    getDrivers,
    getBusinessProcessesByDriver,
    getBusinessProcessData
} from 'services/connectedSystem_v2.js';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
// import ResizeRotateNode from './ResizeRotateNode';
import ProcessDecisionFlow from 'components/connectedSystemRedesign/ValueTab/ProcessDecisionFlow';

const FlowGenerator = ({ classStyles }) => {
    const classes = classStyles;
    // const { selectedTab, setSelectedTab } = props;
    const [processConfig, setProcessConfig] = useState(null);
    // const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [node, setNode] = useState({});
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [nodeFormState, setNodeFormstate] = useState('add');
    // const [nodeHandlesVisibility, setNodeHandlesVisibility] = useState(true);
    const [connectedSystems, setConnectedSystems] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [businessProcesses, setBusinessProcesses] = useState([]);

    const [formOpen, setFormOpen] = useState(false);

    const [selectedConnectedSystem, setSelectedConnectedSystem] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedBusinessProcess, setSelectedBusinessProcess] = useState(null);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification] = useState({});
    const [errors, setErrors] = useState({ nodeText: false });

    // const edgeTypes = {
    //     floating: FloatingEdge
    // };

    // const nodeTypes = {
    //     resizeRotate: ResizeRotateNode
    // };

    // const memoizedNodeTypes = useMemo(() => nodeTypes, [node?.type]);
    // const memoizedEdgeTypes = useMemo(() => edgeTypes, [selectedEdge?.type]);

    // useEffect(() => {
    //     const updatedNodes = nodes.map((node) => {
    //         if (!node.className) {
    //             node.className = classes.hideNode;
    //         } else {
    //             node.className = '';
    //         }
    //         return node;
    //     });
    //     setNodes(updatedNodes);
    // }, [nodeHandlesVisibility]);

    // const onNodesChange = useCallback(
    //     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    //     []
    // );
    // const onEdgesChange = useCallback(
    //     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //     []
    // );
    // const onConnect = useCallback(
    //     (params) =>
    //         setEdges((eds) =>
    //             addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.Arrow } }, eds)
    //         ),
    //     []
    // );

    // const paneClickHandler = useCallback(() => {
    //     setNodeFormstate('add');
    //     setSelectedEdge(null);
    //     setNode({});
    // }, []);

    // const nodeClickHandler = useCallback((e, node) => {
    //     setNode(node);
    //     setNodeFormstate('edit');
    // });

    // const edgeClickHandler = useCallback((e, edge) => {
    //     setSelectedEdge(edge);
    // }, []);

    // const renderNode = (node) => {
    //     return {
    //         ...node,
    //         data: {
    //             label: (
    //                 <div id={node.id} className={classes.nodeWrapper}>
    //                     {node.showIcon ? (
    //                         <div>
    //                             <NodeIcon fill={node.iconColor} />
    //                         </div>
    //                     ) : null}
    //                     <div>{node.text}</div>
    //                 </div>
    //             )
    //         },
    //         style: {
    //             color: node.color,
    //             background: node.background,
    //             borderColor: node.borderColor,
    //             width: node.width,
    //             height: node.height,
    //             fontSize: node.fontSize
    //         },
    //         type: node.type
    //     };
    // };

    const getTransformedNodes = (nodes) => {
        return nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                id: node.id
            }
        }));
    };

    const renderEdge = (edge) => {
        return {
            ...edge,
            style: {
                stroke: edge.color,
                strokeWidth: '1.5px',
                cursor: 'pointer'
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: edge.color || 'grey'
            }
        };
    };

    const getTransformedEdges = (edges) => {
        return edges.map((edge) => renderEdge(edge));
    };

    // const addNodeHandler = () => {
    //     // if (!(node.text && node.text.trim() !== '')) {
    //     //     setErrors({ ...errors, nodeText: true });
    //     //     return;
    //     // }
    //     const nodeId = String(Math.ceil(Math.random() * 1000));
    //     const findNode = nodes.find((n) => n.id === node.id);
    //     let updatedNodes = [];
    //     if (!findNode) {
    //         updatedNodes = [
    //             ...nodes,
    //             {
    //                 ...node,
    //                 id: nodeId,
    //                 text: node.text ? node.text : 'Added node',
    //                 position: {
    //                     x: 0,
    //                     y: 0 + (nodes.length + 1) * 20
    //                 }
    //             }
    //         ];
    //     } else {
    //         updatedNodes = nodes.map((n) => {
    //             if (n.id === findNode.id) {
    //                 return {
    //                     ...n,
    //                     ...node
    //                 };
    //             }
    //             return n;
    //         });
    //     }
    //     setNodes(getTransformedNodes(updatedNodes));
    //     setNode({});
    //     // setErrors({ ...errors, nodeText: false });
    //     setSelectedEdge(null);
    //     setNodeFormstate('add');
    // };

    const onChangeHandler = (value, key) => {
        // Create a copy of the node with the updated key-value pair
        const updatedNode = { ...node, [key]: value };
        if (key === 'heading' && value.trim() !== '') setErrors({ ...errors, nodeHeading: false });
        if (key === 'description' && value.trim() !== '')
            setErrors({ ...errors, nodeDescription: false });
        if (key === 'stakeHolder' && value.trim() !== '')
            setErrors({ ...errors, nodeStakeholder: false });
        // Update the node state
        setNode(updatedNode);

        if (nodeFormState !== 'add') {
            // Map over the nodes and update the matching node if it exists
            const updatedNodes = processConfig.nodes.map((n) =>
                n.data.id === node.id ? { ...n, data: updatedNode } : n
            );
            setProcessConfig({
                ...processConfig,
                nodes: updatedNodes
            });
            // setNodes(getTransformedNodes(updatedNodes));
        }
    };

    const onEdgeChangeHandler = (value, key) => {
        setSelectedEdge({ ...selectedEdge, [key]: value });
        const updatedEdges = edges.map((edge) => {
            if (edge.id === selectedEdge.id) return { ...selectedEdge, ...edge, [key]: value };
            return edge;
        });
        setEdges(getTransformedEdges(updatedEdges));
    };

    // const nodeHandlesHandler = () => {
    //     setNodeHandlesVisibility(!nodeHandlesVisibility);
    // };

    const getConnectedSystemsCallback = (response_data) => {
        let optionList = [];
        response_data.map((val) => {
            optionList.push({ value: val.name, name: val.id });
        });
        setConnectedSystems(optionList);
    };

    const getDriversCallback = (response_data) => {
        let optionList = [];
        response_data.map((val) => {
            optionList.push({ value: val.name, name: val.id });
        });
        setDrivers(optionList);
    };

    const getBusinessProcessesCallback = (response_data) => {
        let optionList = [];
        response_data.map((val) => {
            optionList.push({ value: val.name, name: val.id });
        });
        setBusinessProcesses(optionList);
    };
    useEffect(() => {
        getConnectedSystems({
            callback: getConnectedSystemsCallback
        });
    }, []);

    useEffect(() => {
        if (selectedDriver) {
            getBusinessProcessesByDriver({
                connSystemDriverId: selectedDriver.name,
                callback: getBusinessProcessesCallback
            });
        }
    }, [selectedDriver]);

    useEffect(() => {
        if (selectedConnectedSystem) {
            getDrivers({
                connSystemDashboardId: selectedConnectedSystem.name,
                callback: getDriversCallback
            });
        }
    }, [selectedConnectedSystem]);

    // const saveDecisionFlowCallback = (decisionFlowDetails) => {
    //     if (decisionFlowDetails?.url) {
    //         setNotificationOpen(true);
    //         let notificationNew = {
    //             message: 'Decision flow saved successfully',
    //             severity: 'success'
    //         };
    //         setNotification(notificationNew);
    //     } else {
    //         setNotificationOpen(true);
    //         let notificationNew = {
    //             message: 'Failed to save decision flow',
    //             severity: 'error'
    //         };
    //         setNotification(notificationNew);
    //     }
    // };

    // const getDecisionFlowCallback = (decisionFlowDetails) => {
    //     if (decisionFlowDetails?.status != 'error') {
    //         setNodes(getTransformedNodes(decisionFlowDetails.nodes));
    //         setEdges(getTransformedEdges(decisionFlowDetails.edges));
    //     }
    //     if (decisionFlowDetails?.status === 'error') {
    //         setNodes(getTransformedNodes([]));
    //         setEdges(getTransformedEdges([]));
    //     }
    // };

    const getBusinessProcessDataCallback = (response_data) => {
        if (response_data.process_config?.nodes) {
            setProcessConfig({
                ...response_data.process_config,
                nodes: getTransformedNodes(response_data.process_config.nodes)
            });
        } else {
            setProcessConfig(response_data.process_config);
        }
        // if (response_data.process_config?.nodes && response_data.process_config?.edges) {
        //     setNodes(getTransformedNodes(response_data.process_config.nodes));
        //     setEdges(getTransformedEdges(response_data.process_config.edges))
        // }
    };

    // const handleSave = () => {
    //     // let nodesArr = JSON.parse(JSON.stringify(nodes));
    //     // nodesArr.map((node) => {
    //     //     delete node.data;
    //     //     delete node.style;
    //     // });
    //     // saveDecisionFlow({
    //     //     payload: {
    //     //         nodes: nodesArr,
    //     //         edges: edges
    //     //     },
    //     //     dashboard: selectedDashboard.name,
    //     //     process: selectedProcess.name,
    //     //     problem: selectedProblem.name,
    //     //     question: selectedQuestion?.name,
    //     //     callback: saveDecisionFlowCallback
    //     // });
    // };

    const handleReset = () => {
        const reset = confirm('Do you want to reset ?');
        if (!reset) return;
        // setNodes(getTransformedNodes([]));
        // setEdges(getTransformedEdges([]));

        if (selectedBusinessProcess) {
            getBusinessProcessData({
                connSystemBusinessProcessId: selectedBusinessProcess.name,
                callback: getBusinessProcessDataCallback
            });
        }
    };

    const handleChange = (setState, value) => {
        switch (setState) {
            case 'connected-system':
                setSelectedConnectedSystem(value);
                setSelectedDriver(null);
                setSelectedBusinessProcess(null);
                break;
            case 'driver':
                setSelectedDriver(value);
                setSelectedBusinessProcess(null);
                break;
            case 'business-process':
                setSelectedBusinessProcess(value);
                break;
            default:
                setSelectedConnectedSystem(value);
        }
    };

    const handleAddNode = () => {
        setFormOpen(true);
    };

    const closeFormNodeHandler = () => {
        setFormOpen(false);
    };

    const handleSelectNode = (node_item) => {
        // console.log(node_item);
        setNode(node_item);
        setNodeFormstate('edit');
        setFormOpen(true);
    };

    useEffect(() => {
        if (selectedBusinessProcess) {
            getBusinessProcessData({
                connSystemBusinessProcessId: selectedBusinessProcess.name,
                callback: getBusinessProcessDataCallback
            });
        }
    }, [selectedBusinessProcess]);

    return (
        <div className={classes.bodyWrapper}>
            <Grid container spacing={0} className={classes.bodyWrapper}>
                <Grid item xs={6} className={classes.categoryFormWrapper}>
                    <form className={classes.categoryDropdownsWrapper}>
                        <SimpleSelect
                            onChange={(v) => handleChange('connected-system', v)}
                            fieldInfo={{
                                id: 'connected-system-id',
                                name: 'Connected System',
                                type: 'select',
                                fullWidth: true,
                                variant: 'outlined',
                                value: selectedConnectedSystem
                                    ? selectedConnectedSystem.value
                                    : 'Choose connected system',
                                options: connectedSystems,
                                disabled: !connectedSystems.length,
                                state: 'flow'
                            }}
                        />
                        <SimpleSelect
                            onChange={(v) => handleChange('driver', v)}
                            fieldInfo={{
                                id: 'driver-id',
                                name: 'Driver',
                                type: 'select',
                                fullWidth: true,
                                variant: 'outlined',
                                value: selectedDriver ? selectedDriver.value : 'Choose driver',
                                options: drivers,
                                disabled: !drivers.length,
                                state: 'flow'
                            }}
                        />
                        <SimpleSelect
                            onChange={(v) => handleChange('business-process', v)}
                            fieldInfo={{
                                id: 'business-process-id',
                                name: 'Business Process',
                                type: 'select',
                                fullWidth: true,
                                variant: 'outlined',
                                value: selectedBusinessProcess
                                    ? selectedBusinessProcess.value
                                    : 'Choose business process',
                                options: businessProcesses,
                                disabled: !businessProcesses.length,
                                state: 'flow'
                            }}
                        />
                    </form>
                </Grid>

                <Grid item xs={6} className={classes.buttonsWrapper}>
                    {!formOpen && (
                        <Button onClick={handleAddNode} variant="contained">
                            Add Node
                        </Button>
                    )}
                    <Button onClick={handleReset} variant="contained">
                        Reset
                    </Button>
                    <Button
                        id="node-button"
                        variant="contained"
                        // onClick={addNodeHandler}
                    >
                        Create
                    </Button>
                </Grid>
                <Grid item xs className={classes.reactflowWrapper}>
                    {processConfig && (
                        <ProcessDecisionFlow
                            // actions={actions}
                            // setActions={setActions}
                            selectedProcessConfig={processConfig}
                            setSelectedNode={handleSelectNode}
                        />
                    )}
                </Grid>
                {formOpen && (
                    <Grid xs={3}>
                        <form className={classes.nodesFormWrapper}>
                            <Typography variant="h4">
                                {nodeFormState === 'add' ? 'Create Node' : 'Edit Node'}
                            </Typography>
                            {/* <SimpleSelect
                                        onChange={(v) => onChangeHandler(v.value, 'type')}
                                        fieldInfo={{
                                            id: 'node-type',
                                            name: 'Node Type',
                                            type: 'select',
                                            fullWidth: true,
                                            variant: 'outlined',
                                            label: 'Node Type',
                                            value: node.type || 'default',
                                            options: [
                                                { name: 'default', value: 'default' },
                                                { name: 'input', value: 'input' },
                                                { name: 'output', value: 'output' },
                                                { name: 'Resize Rotate', value: 'resizeRotate' }
                                            ],
                                            state: 'flow'
                                        }}
                                    /> */}
                            {/* <SimpleSelect
                                        onChange={(v) => onChangeHandler(v, 'stakeholders')}
                                        fieldInfo={{
                                            id: 'stakeholders',
                                            name: 'Choose Stakeholders',
                                            type: 'select',
                                            multiple: true,
                                            fullWidth: true,
                                            variant: 'outlined',
                                            label: 'Stakeholders',
                                            optionValueKey: 'value',
                                            value: node.stakeholders || [],
                                            options: [
                                                { value: 'Daniel', name: '1' },
                                                { value: 'Willian', name: '2' },
                                                { value: 'Ollivia', name: '3' },
                                                { value: 'Jamal', name: '4' }
                                            ],
                                            state: 'flow'
                                        }}
                                    /> */}
                            <TextField
                                required
                                id="node-heading"
                                label="Heading"
                                variant="outlined"
                                size="small"
                                placeholder="Enter node heading"
                                value={node.heading || ''}
                                error={errors.nodeHeading}
                                helperText={errors.nodeHeading ? 'Node heading is required' : ''}
                                onChange={(e) => onChangeHandler(e.target.value, 'heading')}
                            />
                            <TextField
                                required
                                id="node-description"
                                label="Description"
                                variant="outlined"
                                size="small"
                                placeholder="Enter node description"
                                value={node.description || ''}
                                error={errors.nodeDescription}
                                helperText={
                                    errors.nodeDescription ? 'Node description is required' : ''
                                }
                                onChange={(e) => onChangeHandler(e.target.value, 'description')}
                                multiline={true}
                                rows={4}
                            />
                            <TextField
                                required
                                id="node-stakeholder"
                                label="Stakeholder"
                                variant="outlined"
                                size="small"
                                placeholder="Enter node stakeholder"
                                value={node.stakeHolder || ''}
                                error={errors.nodeStakeholder}
                                helperText={
                                    errors.nodeStakeholder ? 'Node stakeholder is required' : ''
                                }
                                onChange={(e) => onChangeHandler(e.target.value, 'stakeHolder')}
                            />
                            <TextField
                                required
                                id="node-status"
                                label="Status"
                                variant="outlined"
                                size="small"
                                placeholder="Enter node status"
                                value={node.step || ''}
                                helperText={'Node status types are complete, active, next, tbd'}
                                onChange={(e) => onChangeHandler(e.target.value, 'step')}
                            />
                            {/* <TextField
                                        id="node-bgcolor-input"
                                        label="Background Color"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Enter background hex color code"
                                        value={node.background || ''}
                                        onChange={(e) => onChangeHandler(e.target.value, 'background')}
                                    />
                                    <TextField
                                        id="node-text-color-input"
                                        label="Text Color"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Enter text hex color code"
                                        value={node.color || ''}
                                        onChange={(e) => onChangeHandler(e.target.value, 'color')}
                                    />
                                    <TextField
                                        id="node-border-color-input"
                                        label="Border Color"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Enter border hex color code"
                                        value={node.borderColor || ''}
                                        onChange={(e) => onChangeHandler(e.target.value, 'borderColor')}
                                    />
                                    <TextField
                                        id="node-border-color-input"
                                        label="Width (in px)"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Enter width"
                                        value={node.width || ''}
                                        onChange={(e) => onChangeHandler(e.target.value, 'width')}
                                    />
                                    <TextField
                                        id="node-border-color-input"
                                        label="Height (in px)"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Enter height"
                                        value={node.height || ''}
                                        onChange={(e) => onChangeHandler(e.target.value, 'height')}
                                    />
                                    <TextField
                                        id="node-border-color-input"
                                        label="Font Size"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Enter text font-size"
                                        value={node.fontSize || ''}
                                        onChange={(e) => onChangeHandler(e.target.value, 'fontSize')}
                                    />
                                    <CustomSwitch
                                        onChange={(v) => onChangeHandler(v, 'showIcon')}
                                        params={{
                                            value: node.showIcon || false,
                                            label: 'Show Icon',
                                            size: 'small',
                                            InputLabelProps: {
                                                variant: 'h5'
                                            },
                                            customSelector: classes.switchStyle
                                        }}
                                    />
                                    <TextField
                                        id="node-icon-color-input"
                                        label="Icon Color"
                                        variant="outlined"
                                        size="small"
                                        placeholder="Enter icon hex color code"
                                        disabled={!node.showIcon}
                                        value={node.iconColor || ''}
                                        onChange={(e) => onChangeHandler(e.target.value, 'iconColor')}
                                    /> */}
                            {nodeFormState === 'add' ? (
                                <Button
                                    id="node-button"
                                    variant="contained"
                                    // onClick={addNodeHandler}
                                >
                                    Create
                                </Button>
                            ) : null}
                            <Button
                                id="node-close-button"
                                variant="outlined"
                                onClick={closeFormNodeHandler}
                            >
                                Close
                            </Button>
                        </form>
                        {selectedEdge ? (
                            <form className={classes.nodesFormWrapper}>
                                <Typography variant="h4">Configure Selected Edge</Typography>
                                <SimpleSelect
                                    onChange={(v) => onEdgeChangeHandler(v.value, 'type')}
                                    fieldInfo={{
                                        id: 'edge-type',
                                        name: 'Edge Type',
                                        type: 'select',
                                        fullWidth: true,
                                        variant: 'outlined',
                                        label: 'Edge Type',
                                        value: selectedEdge.type || 'floating',
                                        options: [
                                            { name: 'floating', value: 'floating' },
                                            { name: 'straight', value: 'straight' },
                                            { name: 'step', value: 'step' },
                                            { name: 'smoothstep', value: 'smoothstep' },
                                            { name: 'simplebezier', value: 'simplebezier' }
                                        ],
                                        state: 'flow'
                                    }}
                                />
                                <TextField
                                    id="node-bgcolor-input"
                                    label="Edge Color"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Enter edge hex color code"
                                    value={selectedEdge.color || ''}
                                    onChange={(e) => onEdgeChangeHandler(e.target.value, 'color')}
                                />
                                <CustomSwitch
                                    onChange={(v) => onEdgeChangeHandler(v, 'animated')}
                                    params={{
                                        value: selectedEdge.animated || false,
                                        label: 'Enable Animation',
                                        size: 'small',
                                        InputLabelProps: {
                                            variant: 'h5'
                                        },
                                        customSelector: classes.switchStyle
                                    }}
                                />
                            </form>
                        ) : null}
                    </Grid>
                )}
            </Grid>

            <CustomSnackbar
                open={notificationOpen && notification?.message ? true : false}
                autoHideDuration={
                    notification?.autoHideDuration === undefined
                        ? 3000
                        : notification?.autoHideDuration
                }
                onClose={() => setNotificationOpen(false)}
                severity={notification?.severity || 'error'}
                message={notification?.message}
            />
        </div>
    );
};

export default FlowGenerator;
