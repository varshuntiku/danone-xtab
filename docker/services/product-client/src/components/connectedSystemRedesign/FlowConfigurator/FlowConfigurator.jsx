import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { makeStyles, TextField, Button, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    MarkerType,
    Controls,
    Background,
    ControlButton,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import NavBar from 'components/NavBar.jsx';
import Footer from 'components/Footer.jsx';
import CustomSwitch from 'components/dynamic-form/inputFields/CustomSwitch';
import SimpleSelect from 'components/dynamic-form/inputFields/select';
import { ReactComponent as NodeIcon } from 'assets/img/nodeIcon.svg';
import FloatingEdge from './FloatingEdge';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ResizeRotateNode from './ResizeRotateNode';
import flowConfiguratorStyle from 'assets/jss/flowConfiguratorStyle.jsx';

const useStyles = makeStyles((theme) => ({
    ...flowConfiguratorStyle(theme)
}));

const FlowConfigurator = (props) => {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [selectedTab, setSelectedTab] = useState('summary');
    const [node, setNode] = useState({});
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [nodeFormState, setNodeFormstate] = useState('add');
    const [nodeHandlesVisibility, setNodeHandlesVisibility] = useState(true);

    const classes = useStyles();

    const edgeTypes = {
        floating: FloatingEdge
    };

    const nodeTypes = {
        resizeRotate: ResizeRotateNode
    };

    const memoizedNodeTypes = useMemo(() => nodeTypes, [node?.type]);
    const memoizedEdgeTypes = useMemo(() => edgeTypes, [selectedEdge?.type]);

    useEffect(() => {
        const updatedNodes = nodes.map((node) => {
            if (!node.className) {
                node.className = classes.hideNode;
            } else {
                node.className = '';
            }
            return node;
        });
        setNodes(updatedNodes);
    }, [nodeHandlesVisibility]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    const onConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.Arrow } }, eds)
            ),
        []
    );

    const paneClickHandler = useCallback(() => {
        setNodeFormstate('add');
        setSelectedEdge(null);
        setNode({});
    }, []);

    const nodeClickHandler = useCallback((e, node) => {
        setNode(node);
        setNodeFormstate('edit');
    });

    const edgeClickHandler = useCallback((e, edge) => {
        setSelectedEdge(edge);
    }, []);

    const renderNode = (node) => {
        return {
            ...node,
            data: {
                label: (
                    <div id={node.id} className={classes.nodeWrapper}>
                        {node.showIcon ? (
                            <div>
                                <NodeIcon fill={node.iconColor} />
                            </div>
                        ) : null}
                        <div>{node.text}</div>
                    </div>
                )
            },
            style: {
                color: node.color,
                background: node.background,
                borderColor: node.borderColor,
                width: node.width,
                height: node.height,
                fontSize: node.fontSize
            },
            type: node.type
        };
    };

    const getTransformedNodes = (nodes) => {
        return nodes.map((node) => renderNode(node));
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

    const addNodeHandler = () => {
        const nodeId = String(Math.ceil(Math.random() * 1000));
        const findNode = nodes.find((n) => n.id === node.id);
        let updatedNodes = [];
        if (!findNode) {
            updatedNodes = [
                ...nodes,
                {
                    ...node,
                    id: nodeId,
                    text: node.text ? node.text : 'Added node',
                    position: {
                        x: 0,
                        y: 0 + (nodes.length + 1) * 20
                    }
                }
            ];
        } else {
            updatedNodes = nodes.map((n) => {
                if (n.id === findNode.id) {
                    return {
                        ...n,
                        ...node
                    };
                }
                return n;
            });
        }
        setNodes(getTransformedNodes(updatedNodes));
        setNode({});
        setSelectedEdge(null);
        setNodeFormstate('add');
    };

    const onChangeHandler = (value, key) => {
        // Create a copy of the node with the updated key-value pair
        const updatedNode = { ...node, [key]: value };

        // Update the node state
        setNode(updatedNode);

        if (nodeFormState !== 'add') {
            // Map over the nodes and update the matching node if it exists
            const updatedNodes = nodes.map((n) => (n.id === node.id ? updatedNode : n));
            setNodes(getTransformedNodes(updatedNodes));
        }
    };

    const onEdgeChangeHandler = (value, key) => {
        const updatedEdges = edges.map((edge) => {
            if (edge.id === selectedEdge.id) return { ...selectedEdge, ...edge, [key]: value };
            return edge;
        });
        setEdges(getTransformedEdges(updatedEdges));
    };

    const nodeHandlesHandler = () => {
        setNodeHandlesVisibility(!nodeHandlesVisibility);
    };

    return (
        <div className={classes.pageWrapper}>
            <NavBar {...props} />
            <div className={classes.bodyWrapper}>
                <div className={classes.tabsWrapper}>
                    <div
                        className={`${classes.tab} ${
                            selectedTab === 'dashboard' && classes.selectedTab
                        }`}
                        onClick={() => setSelectedTab('dashboard')}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`${classes.tab} ${
                            selectedTab === 'detailed' && classes.selectedTab
                        }`}
                        onClick={() => setSelectedTab('detailed')}
                    >
                        Detailed View
                    </div>
                    <div
                        className={`${classes.tab} ${
                            selectedTab === 'summary' && classes.selectedTab
                        }`}
                        onClick={() => setSelectedTab('summary')}
                    >
                        Summary
                    </div>
                </div>
                {selectedTab === 'summary' && (
                    <>
                        <div className={classes.categoryFormWrapper}>
                            <form className={classes.categoryDropdownsWrapper}>
                                <SimpleSelect
                                    onChange={(v) => v}
                                    fieldInfo={{
                                        id: 'dashboard-id',
                                        name: 'Dashboard Id',
                                        type: 'select',
                                        fullWidth: true,
                                        variant: 'outlined',
                                        value: 'Choose dashboard id',
                                        options: [
                                            { value: 'CPG-RGM', name: '1' },
                                            { value: 'Pharma', name: '2' }
                                        ],
                                        state: 'flow'
                                    }}
                                />
                                <SimpleSelect
                                    onChange={(v) => v}
                                    fieldInfo={{
                                        id: 'driver',
                                        name: 'Driver',
                                        type: 'select',
                                        fullWidth: true,
                                        variant: 'outlined',
                                        value: 'Choose driver',
                                        options: [
                                            { value: 'Pricing', name: '1' },
                                            { value: 'Promo', name: '2' },
                                            { value: 'Forecasting', name: '3' }
                                        ],
                                        state: 'flow'
                                    }}
                                />
                                <SimpleSelect
                                    onChange={(v) => v}
                                    fieldInfo={{
                                        id: 'business-process',
                                        name: 'Business Process',
                                        type: 'select',
                                        fullWidth: true,
                                        variant: 'outlined',
                                        value: 'Choose business process',
                                        options: [
                                            { value: 'Yearly Pricing Strategy', name: '1' },
                                            { value: 'Mide Year Review', name: '2' },
                                            { value: 'Measurement', name: '3' }
                                        ],
                                        state: 'flow'
                                    }}
                                />
                                <SimpleSelect
                                    onChange={(v) => v}
                                    fieldInfo={{
                                        id: 'main-question',
                                        name: 'Main Question',
                                        type: 'select',
                                        fullWidth: true,
                                        variant: 'outlined',
                                        value: 'Choose main question',
                                        options: [
                                            {
                                                value: 'Redefine price point based on actual elasticity',
                                                name: '1'
                                            },
                                            {
                                                value: 'Prioritize retail channels to drive changes',
                                                name: '2'
                                            },
                                            { value: 'Review current trade discount', name: '3' }
                                        ],
                                        state: 'flow'
                                    }}
                                />
                            </form>
                        </div>
                        <div className={classes.reactflowWrapper}>
                            <ReactFlow
                                fitView
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                edgeTypes={memoizedEdgeTypes}
                                nodeTypes={memoizedNodeTypes}
                                onPaneClick={paneClickHandler}
                                onNodeClick={nodeClickHandler}
                                onEdgeClick={edgeClickHandler}
                                proOptions={{ hideAttribution: true, account: 'paid-pro' }}
                            >
                                <Controls>
                                    <ControlButton onClick={nodeHandlesHandler} title="action">
                                        {nodeHandlesVisibility ? (
                                            <VisibilityIcon fontSize="large" />
                                        ) : (
                                            <VisibilityOffIcon fontSize="large" />
                                        )}
                                    </ControlButton>
                                </Controls>
                                <Background />
                            </ReactFlow>
                        </div>
                        <div className={classes.formsWrapper}>
                            <form className={classes.nodesFormWrapper}>
                                <Typography variant="h4">
                                    {nodeFormState === 'add' ? 'Create Node' : 'Edit Node'}
                                </Typography>
                                <SimpleSelect
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
                                />
                                <SimpleSelect
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
                                />
                                <TextField
                                    required
                                    id="node-input"
                                    label="Node Text"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Enter node text"
                                    value={node.text || ''}
                                    onChange={(e) => onChangeHandler(e.target.value, 'text')}
                                />
                                <TextField
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
                                    label="Width"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Enter width"
                                    value={node.width || ''}
                                    onChange={(e) => onChangeHandler(e.target.value, 'width')}
                                />
                                <TextField
                                    id="node-border-color-input"
                                    label="Height"
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
                                    value={node.iconColor || ''}
                                    onChange={(e) => onChangeHandler(e.target.value, 'iconColor')}
                                />
                                {nodeFormState === 'add' ? (
                                    <Button
                                        id="node-button"
                                        variant="contained"
                                        onClick={addNodeHandler}
                                    >
                                        Create
                                    </Button>
                                ) : null}
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
                                        onChange={(e) =>
                                            onEdgeChangeHandler(e.target.value, 'color')
                                        }
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
                        </div>
                        <div className={classes.buttonsWrapper}>
                            <Button variant="contained">Reset</Button>
                            <Button variant="contained">Save</Button>
                        </div>
                    </>
                )}
            </div>
            <div className={classes.footerWrapper}>
                <Footer />
            </div>
        </div>
    );
};

export default withTheme(FlowConfigurator);
