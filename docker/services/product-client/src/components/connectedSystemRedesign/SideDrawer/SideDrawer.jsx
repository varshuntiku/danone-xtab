import React, { useState, useEffect } from 'react';
import Intelligence from './Intelligence';
import Datasets from './Datasets';
import Infrastructure from './Infrastructure';
import { getKpiInsights } from '../../../services/dashboard.js';
import { Typography, useTheme, withStyles } from '@material-ui/core';
import connectedSystemSideDrawerStyle from 'assets/jss/connectedSystemSideDrawerStyle.jsx';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { ReactComponent as Database } from '../Foundation/icons/Database.svg';
import { ReactComponent as Bargraph } from '../Foundation/icons/BarGraph.svg';
import { ReactComponent as Solution } from '../Foundation/icons/Solution.svg';
import { ReactComponent as Analysis } from '../Foundation/icons/Analysis.svg';
import { ReactComponent as Tickmark } from '../Foundation/icons/TickMark.svg';
import { getDecisionFlowData } from 'services/connectedSystem';

const SideDrawer = (props) => {
    const classes = props.classes;
    const [kpiCOunt, setKpiCount] = useState(0);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const screenRatio = window.screen.availWidth / document.documentElement.clientWidth;
    const screenWidth = parseFloat(window.screen.availWidth / screenRatio);
    const computedStyle = getComputedStyle(document.documentElement);
    const remToPx = (rem) => parseFloat(computedStyle.fontSize) * rem;
    const theme = useTheme();

    const getIcon = (icon) => {
        switch (icon) {
            case 'file':
                return <InsertDriveFileOutlinedIcon className={classes.Fileicon} />;
            case 'graph':
                return <Analysis className={classes.icon} />;
            case 'aggregate':
                return <Bargraph className={classes.icon} />;
            case 'dashboard':
                return <Solution className={classes.icon} />;
            case 'database':
                return <Database className={classes.icon} />;
            case 'quality':
                return <Tickmark className={classes.icon} />;

            default:
                return <InfoOutlinedIcon className={classes.icon} />;
        }
    };

    const renderContent = (content) => {
        return (
            <div className={classes.renderElement}>
                <div className={classes.titleContent}>
                    <Typography className={classes.heading}>{content.title}</Typography>
                    {getIcon(content?.icon)}
                </div>
                <div className={classes.description}>{content.description}</div>
            </div>
        );
    };

    const fetchDecisionFlowData = () => {
        getDecisionFlowData(props.dashboardCode, props.tab).then((response) => {
            setNodes(response.decisions?.nodes);
            setEdges(response.decisions?.edges);
        });
    };

    useEffect(() => {
        try {
            const responseCount = (response_data) => {
                setKpiCount(response_data['data']);
            };
            getKpiInsights({
                dashboard_id: 1,
                process_id: 2,
                problem_definition_id: 1,
                callback: responseCount
            });
            props.tab && fetchDecisionFlowData();
        } catch (error) {
            return 12;
        }
    }, []);

    // TODO: Remove this static data and the related code once older decision flow UX is completely deprecated.
    const data = {
        intelligence: [
            {
                label: 'KPIs',
                value: props.selected_workflow == 'wf_node_4' ? kpiCOunt : 12,
                showGraph: true,
                graphData: {
                    x: [
                        '01-06-2023',
                        '02-06-2023',
                        '03-06-2023',
                        '04-06-2023',
                        '05-06-2023',
                        '06-06-2023',
                        '07-06-2023'
                    ],
                    y: [0, 65, 80, 55, 60, 95, 10]
                },
                graphLabel: 'Quality'
            },
            {
                label: 'Models',
                value: 4,
                showGraph: true,
                graphData: {
                    x: [
                        '01-06-2023',
                        '02-06-2023',
                        '03-06-2023',
                        '04-06-2023',
                        '05-06-2023',
                        '06-06-2023',
                        '07-06-2023'
                    ],
                    y: [0, 65, 70, 75, 80, 95, 0]
                },
                graphLabel: 'Accuracy'
            },
            {
                label: 'Decisions',
                value: 7,
                showGraph: false,
                graphData: [],
                graphLabel: ''
            }
        ],
        datasets: [
            {
                label: 'Sources',
                serial: 4,
                freshness: '5hr',
                drift: '5%',
                graphData: {
                    x: [
                        '01-06-2023',
                        '02-06-2023',
                        '03-06-2023',
                        '04-06-2023',
                        '05-06-2023',
                        '06-06-2023',
                        '07-06-2023'
                    ],
                    y: [0, 85, 85, 90, 95, 95, 0]
                },
                graphLabel: 'Quality'
            },
            {
                label: 'Consumption',
                serial: 2,
                freshness: '5hr',
                drift: '1%',
                graphData: {
                    x: [
                        '01-06-2023',
                        '02-06-2023',
                        '03-06-2023',
                        '04-06-2023',
                        '05-06-2023',
                        '06-06-2023',
                        '07-06-2023'
                    ],
                    y: [0, 85, 85, 90, 95, 95, 0]
                },
                graphLabel: 'Quality'
            }
        ],
        infrastructure: [
            {
                label: 'Storage',
                value: '$0.6M'
            },
            {
                label: 'Compute',
                value: '$0.75M'
            }
        ]
    };

    const styleNode = {
        border: theme.ConnectedSystemDashboard.sideDrawer.border,
        background: theme.ConnectedSystemDashboard.sideDrawer.background,
        borderRadius: '0.5rem',
        boxShadow: 'none',
        width: 'fit-content',
        maxHeight: '7rem',
        height: 'fit-content',
        zindex: 1000,
        padding: '0rem'
    };

    const getNodePosition = () => {
        switch (true) {
            case screenWidth > 1366 && screenWidth <= 1500:
                return screenWidth / 5 - remToPx(19);
            case screenWidth > 1500:
                return screenWidth / 5 - remToPx(22.7);
            default:
                return screenWidth / 5 - remToPx(22.5);
        }
    };

    const nodePosition = getNodePosition();

    const updatedNodes = nodes.map((node) => {
        const positionXMultiplier =
            node?.positionXMultiplier !== undefined ? node.positionXMultiplier : 1;
        return {
            ...node,
            data: {
                label: renderContent({
                    title: node?.title,
                    description: node?.description,
                    icon: node?.icon
                })
            },
            style: styleNode,
            position: {
                x: node?.positionX || nodePosition * positionXMultiplier,
                y: node?.positionY
            }
        };
    });

    function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
        const edgePath = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;

        return (
            <>
                <path
                    id={id}
                    d={edgePath}
                    style={{
                        stroke: theme.ConnectedSystemDashboard.sideDrawer.edge,
                        strokeWidth: 1,
                        fill: 'none'
                    }}
                />
                <text
                    x={(sourceX + targetX) / 2}
                    y={(sourceY + targetY) / 2 + 5}
                    fill={theme.ConnectedSystemDashboard.sideDrawer.edge}
                    fontSize="18"
                    textAnchor="middle"
                >
                    &raquo;
                </text>
            </>
        );
    }

    function Customstepedge({ id, sourceX, sourceY, targetX, targetY, style = {} }) {
        const stepFactor = 0.5;
        const stepX = sourceX + (targetX - sourceX) * stepFactor;
        let edgePath = `M ${sourceX},${sourceY} H ${stepX} V ${targetY} H ${targetX}`;
        if (style?.width) {
            edgePath = `M ${sourceX - 150},${sourceY} H ${stepX} V ${targetY} H ${targetX + 150}`;
        }
        return (
            <>
                <path
                    id={id}
                    d={edgePath}
                    style={{
                        stroke: theme.ConnectedSystemDashboard.sideDrawer.edge,
                        strokeWidth: 1,
                        fill: 'none'
                    }}
                />
                <text
                    x={targetX}
                    y={targetY + 4.5}
                    fill={theme.ConnectedSystemDashboard.sideDrawer.edge}
                    fontSize="18"
                    textAnchor="middle"
                >
                    &raquo;
                </text>
            </>
        );
    }
    const edgeTypes = {
        customedge: CustomEdge,
        customstep: Customstepedge
    };

    return (
        <div className={classes.connSystemCardSubMainBigDrawer}>
            {!props?.tab && (
                <div>
                    <svg style={{ position: 'absolute' }}>
                        <defs>
                            <linearGradient id="graph-gradient" gradientTransform="rotate(90)">
                                <stop offset="0%" stopColor="rgba(71, 94, 191, 1)" />
                                <stop offset="100%" stopColor="rgba(104, 131, 247, 0.0001)" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className={classes.connSystemCardSubMainBigDrawerItem}>
                        <Intelligence data={data} />
                    </div>
                    <div className={classes.connSystemCardSubMainBigDrawerItem}>
                        <Datasets data={data} />
                    </div>
                    <div className={classes.connSystemCardSubMainBigDrawerItem}>
                        <Infrastructure data={data} />
                    </div>
                </div>
            )}

            {props?.tab === 2 && (
                <div className={classes.drawerReactflowContainer}>
                    <Typography className={classes.dataText}>Data Flow Tracker</Typography>
                    <div className={classes.sideDrawerFlow}>
                        <ReactFlow
                            nodes={updatedNodes}
                            edges={edges}
                            edgeTypes={edgeTypes}
                            proOptions={{ hideAttribution: true, account: 'paid-pro' }}
                            zoomOnScroll={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default withStyles(connectedSystemSideDrawerStyle, { withTheme: true })(SideDrawer);
