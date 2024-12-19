import { useEffect, useState } from 'react';
import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import { makeStyles } from '@material-ui/core';
import { getHierarchy, getApplicationScreens } from '../../services/dashboard';
import Navbar from '../NavBar';
import { useSpring, animated, useTrail } from '@react-spring/web';
import CodxCircularLoader from '../CodxCircularLoader';
const useStyles = makeStyles(() => ({
    circle: {
        width: '40rem',
        height: '75rem',
        backgroundColor: '#43bebd',
        borderRadius: '40rem 0.5rem 0.5rem 40rem',
        transform: 'rotate(180deg)',
        marginTop: '12rem'
    },
    text: {
        color: '#000000',
        fontSize: '5rem',
        position: 'absolute',
        top: '46rem',
        left: '10rem',
        fontWeight: '5rem'
    },
    main: {
        position: 'relative'
    },
    reactFlowContainer: {
        height: '100%',
        width: '100%'
    },
    dashboard: {
        display: 'flex',
        height: '100%',
        backgroundColor: '#0C2744'
    },
    branch: {
        animationName: 'branch',
        animationDuration: '4s',
        animation: 'branch 0.25s linear',
        color: 'yellow'
    },
    '@keyframes branch': {
        '0%': { left: '-100px' },
        '50%': { left: '50px' },
        '100%': { left: '0px' }
    },
    loader: {
        position: 'fixed',
        top: '50%',
        left: '50%'
    }
}));

function CatsDashboard({ dashboardId }) {
    const [springs] = useSpring(
        () => ({
            from: { x: -100 },
            to: { x: 20 },
            delay: 1000,
            // loop: true,
            config: {
                mass: 1,
                friction: 50,
                tension: 250,
                velocity: 2
            }
        }),
        []
    );

    const [branchsprings, branchapi] = useSpring(
        () => ({
            from: { x: -100 },
            config: { mass: 1, tension: 170, friction: 126 }
        }),
        []
    );

    const Trail = ({ children }) => {
        const items = React.Children.toArray(children);
        const trail = useTrail(items.length, {
            config: { mass: 5, tension: 2000, friction: 1000 },
            //   opacity:  1 ,
            //   x: 0 ,
            //   height:  110 ,
            from: { opacity: 0 },
            to: { opacity: 1 },
            delay: 1000
        });
        return (
            <div>
                {trail.map(({ height, ...style }, index) => (
                    <animated.div key={index} className={classes.text} style={style}>
                        <animated.div style={{ height }}>{items[index]}</animated.div>
                    </animated.div>
                ))}
            </div>
        );
    };

    const classes = useStyles();
    const [loader, setLoader] = useState(true);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [positions, setPositions] = useState([]);
    const nodeWidth = 300;
    const nodeHeight = 40;
    let id = 1;
    const getId = () => {
        return id++;
    };

    const branchStyle = {
        border: 'none',
        background: 'transparent',
        color: 'white',
        visibility: 'unset',
        width: 'fit-content',
        textAlign: 'left',
        paddingLeft: '20px',
        cursor: 'pointer',
        boxShadow: 'none'
    };
    const appStyle = {
        borderRadius: '30px',
        background: '#0a3758',
        color: '#3eb2b4',
        visibility: 'unset',
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`,
        cursor: 'pointer',
        border: 'none'
    };

    const branchlabelstyle = {
        color: '#ffffff',
        textDecoration: 'none'
    };

    const renderFunctions = (content) => {
        return <animated.div style={{ ...springs }}>{content}</animated.div>;
    };

    const renderBranches = (branch, applicationname) => {
        let screenLabel = applicationname ? `${applicationname}-${branch.label}` : branch.label;
        let screenRedirect = branch.label.split(' ').join('-').toLowerCase();
        return (
            <animated.a
                data-testid="branch-link"
                style={{ ...branchlabelstyle, ...branchsprings }}
                href={
                    branch.type === 'application'
                        ? `/app/${branch.id}`
                        : `/app/${branch.app_id}/${screenRedirect}`
                }
                target="_blank"
                className={classes.branch}
            >
                {branch.type === 'application' ? `${branch.label}-Home` : screenLabel}
            </animated.a>
        );
    };

    const animationBranches = (api) => {
        api.start({
            from: { x: -100, opacity: 0 },
            to: { x: 0, opacity: 1 },
            config: { mass: 1, tension: 170, friction: 126 }
        });
    };

    const getData = async () => {
        try {
            const response = await getHierarchy({ dashboardId: dashboardId });
            if (response) {
                const functions_api = response.result.filter((obj) => obj.type === 'function');
                let funcLen = functions_api.length;
                let funcPos = Math.round(funcLen / 2);
                let intX = 10;
                let intY = 200;
                let gapX = 60;
                let gapY = 150;
                let actualNodes = [];
                let actualX;
                let actualY;
                for (const [index, func] of functions_api.entries()) {
                    let Ftop;
                    let Fbottom;
                    if (index + 1 < funcPos) {
                        Ftop = intX + index * gapX;
                        actualX = Ftop;
                    } else if (index + 1 === funcPos) {
                        actualX = (index + 1) * gapX - intX;
                    } else if (index + 1 > funcPos) {
                        if (funcLen % 2) {
                            Fbottom = funcPos * gapX - intX - (index + 1 - funcPos) * gapX;
                        } else {
                            let diff = funcPos - (index + 1);
                            if (diff === -1) {
                                Fbottom = funcPos * gapX - intX;
                            } else {
                                Fbottom = funcPos * gapX - intX - (index + 1 - funcPos) * gapX;
                            }
                        }

                        actualX = Fbottom;
                    }
                    actualY = index * gapY + intY;
                    let postionObj = { x: actualX, y: actualY, function_id: func.id };
                    setPositions((prevstate) => [...prevstate, postionObj]);
                    actualNodes.push({
                        id: String(getId()),
                        style: appStyle,
                        position: { x: actualX, y: actualY },
                        data: {
                            label: renderFunctions(func.label, func.id, functions_api)
                        },
                        sourcePosition: 'right',
                        function_id: func.id,
                        type: 'input',
                        node_type: 'function'
                    });
                }
                setNodes(actualNodes);
                setLoader(false);
            }
        } catch (err) {
            return false;
        }
    };

    const getBranches = async (event, node) => {
        if (node.node_type === 'function') {
            animationBranches(branchapi);
            const appsScreens = await getApplicationScreens({ functionID: node.function_id });
            let branches = [];
            let xPos = positions.filter((pos) => pos.function_id === node.function_id)[0]['x'];
            let edges = [];
            let function_source = node.id;
            let actualbranches = [...appsScreens.applications, ...appsScreens.screens];
            let applicationName;
            let nodeLen = nodes.length;
            for (const [index, branch] of actualbranches.entries()) {
                applicationName =
                    branch.type === 'screens'
                        ? actualbranches.filter(
                              (obj) => obj.id === branch.app_id && obj.type === 'application'
                          )[0]['label']
                        : null;
                let id = branch.type === 'application' ? 'application_id' : 'screen_id';
                let checkNode = nodes.some((node) => node[id] === branch.id);
                let yPos = positions.filter((pos) => pos.function_id === node.function_id)[0]['y'];
                let branchPos = Math.round(actualbranches.length / 2);
                let yGap = 30;
                let yTop;
                let yBottom;
                let actualY;
                nodeLen += 1;
                if (branchPos > index + 1) {
                    yTop = yPos - yGap * (branchPos - (index + 1));
                    actualY = yTop;
                } else if (branchPos === index + 1) {
                    actualY = yPos;
                } else if (branchPos < index + 1) {
                    yBottom = yPos + yGap * (index + 1 - branchPos);
                    actualY = yBottom;
                }
                if (!checkNode) {
                    let node_id = branch.type === 'application' ? 'application_id' : 'screen_id';
                    let newBranch = {
                        id: String(nodeLen),
                        style: branchStyle,
                        data: {
                            label: renderBranches(branch, applicationName)
                        },
                        position: { x: xPos + nodeWidth + 150, y: actualY },
                        targetPosition: 'left',
                        sourcePosition: 'left',
                        type: 'output',
                        node_type: branch.type
                    };
                    newBranch[node_id] = branch.id;
                    branches.push(newBranch);
                    edges.push({
                        id: `el-${String(Math.round(Math.random() * 1000))}`,
                        source: String(function_source),
                        target: String(nodeLen)
                    });
                } else {
                    return;
                }
            }
            setNodes((prevstate) => [...prevstate, ...branches]);
            setEdges((prevstate) => [...prevstate, ...edges]);
        }
        if (node.type === 'application' || node.type === 'screens') {
            return;
        }
    };
    useEffect(() => {
        getData();
    }, []);

    return (
        <React.Fragment>
            <Navbar />
            <div className={classes.dashboard}>
                <div className={classes.main}>
                    <div className={classes.circle} data-testid="circle"></div>
                    <Trail data-testid="trail">
                        <span>CATS</span>
                    </Trail>
                </div>
                <div className={classes.reactFlowContainer}>
                    {loader ? (
                        <div className={classes.loader}>
                            <CodxCircularLoader />
                        </div>
                    ) : (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodeClick={getBranches}
                            proOptions={{ hideAttribution: true, account: 'paid-pro' }}
                            data-testid="reactflow-component"
                        />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

export default CatsDashboard;
