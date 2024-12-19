import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import ReactFlow, { addEdge, Controls, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import NavBar from '../NavBar';
import { getHierarchy } from '../../services/dashboard';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import sanitizeHtml from 'sanitize-html-react';

const useStyles = makeStyles(() => ({
    wrapper: {
        background: '#dedede',
        borderRadius: '50%',
        display: 'flex',
        alignContent: 'center',
        verticalAlign: 'middle',
        transition: ' height 1s, heights 1s'
    },
    cicleWrapper: {
        overflow: 'hidden'
    },
    wrapperClose: {
        position: 'fixed',
        background: '#dedede',
        borderRadius: '50%',
        transition: ' width 1s, height 1s',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    wrapperOpen: {
        position: 'fixed',
        background: '#dedede',
        borderRadius: '50%',
        alignContent: 'center',
        verticalAlign: 'middle',
        transition: ' width 1s, height 1s',
        fontSize: '3rem',
        color: 'white'
    },
    initialLabel: {
        fontWeight: 'bold',
        position: 'inherit'
    },
    restCloseLabels: {
        fill: '#e1e4e6',
        fontWeight: 'bold'
    },
    openLabels: {
        display: 'inline-block',
        fontSize: '4rem',
        fontWeight: 'bold'
    },
    standardText: {
        textAlign: 'right',
        paddingTop: '30%',
        paddingRight: '10%'
    },
    textBody1: {
        fontSize: '3rem',
        color: 'white'
    },
    textBody2: {
        fontSize: '3rem',
        color: '#3eb2b4'
    },
    textBody3: {
        fontSize: '1.8rem',
        color: 'white'
    },
    videoStyles: {
        objectFit: 'fill',
        width: '100%',
        height: '100vh'
    },
    searchIcon: {
        position: 'absolute',
        left: 90,
        marginTop: '0.5rem',
        fontSize: '2rem',
        cursor: 'pointer',
        border: '1px solid white',
        borderRadius: '5rem',
        padding: '1.5rem',
        color: 'white'
    },
    searchInput: {
        paddingLeft: '4rem',
        minWidth: '8rem',
        minHeight: '2.5rem',
        visibility: 'hidden',
        opacity: 0,
        transition: 'visibility 0s, opacity 0.25s ease-out',
        color: 'white',
        border: '0.1rem solid white',
        borderRadius: '2rem',
        background: 'transparent',
        fontWeight: 300
    },
    inputHolder: {
        position: 'relative',
        marginLeft: '80%',
        marginTop: '2rem'
    },
    viewAppStyles: {
        display: 'none',
        alignItems: 'center',
        zIndex: 1000,
        opacity: 0.7,
        cursor: 'pointer',
        width: '4rem',
        height: '4rem',
        border: '1px solid white',
        borderRadius: '50%',
        fontSize: '1.5rem',
        padding: '1rem',
        position: 'fixed'
    },
    paginationHolder: {
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: 'row',
        zIndex: 1000,
        left: `70%`,
        bottom: `48%`,
        position: 'absolute'
    },
    paginationText: {
        fontSize: '1.25rem',
        paddingLeft: '0.25rem',
        paddingRight: '0.25rem'
    },
    paginateDisableIcons: {
        pointerEvents: 'none',
        opacity: 0.5
    },
    paginateEnableIcons: {
        pointerEvents: 'auto',
        opacity: 1
    },
    paginationIcons: {
        fill: 'white',
        fontSize: '4rem'
    }
}));

const devicePixelRatio = window.devicePixelRatio;

const getLabelDefaults = () => {
    switch (devicePixelRatio) {
        case 1:
            return [1135, 1827];
        case 1.25:
            return [1175, 1650];
        default:
            return [1145, 1512];
    }
};

const getCloseDefaults = () => {
    switch (devicePixelRatio) {
        case 1:
            return [1975, 1875];
        case 1.25:
            return [2125, 1700];
        default:
            return [2025, 1550];
    }
};

const getRetailTextDefaults = () => {
    switch (devicePixelRatio) {
        case 1:
            return [7, 7, 3];
        case 1.25:
            return [8, 8, 4];
        default:
            return [11, 11, 4];
    }
};

const getFlowZoom = () => {
    switch (devicePixelRatio) {
        case 1:
            return 1.25;
        case 1.25:
            return 1.1;
        default:
            return 1;
    }
};

const getNodeDefaults = () => {
    switch (devicePixelRatio) {
        case 1:
            return [880, 580];
        case 1.25:
            return [1075, 765];
        default:
            return [1245, 950];
    }
};

const getAppDefaults = () => {
    switch (devicePixelRatio) {
        case 1:
            return [1280, 495];
        case 1.25:
            return [1450, 680];
        default:
            return [1620, 850];
    }
};

const nodeDefaults = getNodeDefaults();
const appDefaults = getAppDefaults();

const NODE_POSITION_X = nodeDefaults[0];
const NODE_POSITION_Y = nodeDefaults[1];
const APP_POSITION_X = appDefaults[0];
const APP_POSITION_Y = appDefaults[1];
const SIZE_CHANGE = 275;
const INCREMENTAL_SIZE_CHANGE = 20;
const bgColors = {
    1: '#43bebd',
    2: '#3eb2b4',
    3: '#2e8f99',
    4: '#1b6077',
    5: '#0a3758'
};

const getSize = (sizeArr, position, isOpen) => {
    const newArr = [...sizeArr];

    sizeArr.forEach((size, index) => {
        if (index === position) {
            if (isOpen) {
                newArr[position] -= SIZE_CHANGE;
            } else {
                newArr[position] += SIZE_CHANGE;
            }
        } else if (index > position) {
            newArr[index] = newArr[index - 1] + INCREMENTAL_SIZE_CHANGE;
        }
    });

    return newArr;
};

const onInit = () => {};

const transformNodesEdges = (data, openIndex, viewApps) => {
    let layerMultiplier = [8, 7, 5, 5, 3, 1.5, 1, 1];
    let multiplier = 5 * layerMultiplier[openIndex !== 1000 ? openIndex + 1 : 1];
    let functionNodes = data.filter((el) => el.type === 'function');
    functionNodes = functionNodes.slice(0, 5);
    const appNodes = data.filter((el) => el.type === 'application');
    let yGaps = [0, 0, 0, 0, 0, 10, 20, 25, 35, 40, 40, 40, 40, 40];
    let Ygap = yGaps[functionNodes.length - 1];
    let xGaps = [0, 120, 210, 220, 215, 200];
    const yIncFunc = !viewApps
        ? devicePixelRatio === 1.5
            ? 85 - Ygap
            : 90 - Ygap
        : devicePixelRatio === 1.5
        ? 85
        : 90;
    const transformedFunctionNodes = functionNodes.map(({ id, label }, i) => {
        const xInc = !viewApps
            ? [-150, -50, 50, 125, 190, 225, 220, 215, 200, 215]
            : [0, 150, 250, 300, 250, 190, 200, 180, 150, 120, 110];
        let xPos;

        if (functionNodes.length <= 6) {
            xPos = xGaps[i];
        } else {
            xPos = xInc[i];
        }
        return {
            id: String(id),
            style: {
                borderRadius: '30px',
                background: '#0a3758',
                color: '#3eb2b4',
                visibility: 'unset',
                width: '180px',
                height: '40px'
            },
            data: { label },
            position: {
                x: NODE_POSITION_X + xPos + multiplier * 5.5 + openIndex * 100,
                y: NODE_POSITION_Y + i * yIncFunc + openIndex * 20 - multiplier * 3.5
            },
            targetPosition: 'right',
            sourcePosition: 'right'
        };
    });

    const xInc = [0, 100, 150, 200, 150, 130, 130, 100, 100];
    const transformedAppNodes = [];
    let baseX = APP_POSITION_X;
    let baseY = APP_POSITION_Y;
    let k = 0;
    const yIncApp = devicePixelRatio === '1.5' ? 30 : 45;

    functionNodes.forEach(({ id }, j) => {
        const appNodesForFnNode = appNodes.filter((el) => el.parent_function_id === id);
        const sanitizedHref = sanitizeHtml(`/app/${id}`);
        const transformedAppNodesForFnNode = appNodesForFnNode.map(({ id, label }) => {
            k += 1;
            return {
                id: String(id),
                style: {
                    border: 'none',
                    background: 'transparent',
                    color: 'white',
                    visibility: 'unset',
                    width: '200px',
                    textAlign: 'left',
                    paddingLeft: '20px'
                },
                data: {
                    label: (
                        <a
                            href={sanitizedHref}
                            target="_blank"
                            style={{ color: 'white', textDecoration: 'none' }}
                            rel="noreferrer"
                        >
                            {label}
                        </a>
                    )
                },
                position: {
                    x: baseX + openIndex * 100 + xInc[j] + multiplier * 5,
                    y: baseY + openIndex * 20 + k * yIncApp - multiplier * 5
                },
                targetPosition: 'left',
                sourcePosition: 'left'
            };
        });
        transformedAppNodes.push(...transformedAppNodesForFnNode);
    });

    const edges = [];
    appNodes.forEach((appNode) => {
        edges.push({
            id: `e${appNode.parent_function_id}-${appNode.id}`,
            source: String(appNode.parent_function_id),
            target: String(appNode.id),
            animated: false,
            hidden: false
        });
    });

    return [[...transformedFunctionNodes, ...transformedAppNodes], edges];
};

export default function ConcentricCirclesDashboard(props) {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [allClose, setAllClose] = useState(true);
    const [openIndex, setOpenIndex] = useState(1000);
    const [currentLayerId, setCurrentLayerId] = useState(null);
    const [nodeToIndexMapping, setNodeToIndexMapping] = useState({});

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const initHeights = [];
    const initWidths = [];
    const initOpen = {};

    const [widths, setWidth] = useState(initWidths);
    const [heights, setHeight] = useState(initHeights);
    const [isOpenObj, setOpen] = useState(initOpen);

    const [videoEnd, setVideoEnd] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [apps, setApps] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const viewApps = true;
    const [selectedFunctions, setSelectedFunctions] = useState([]);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const formatData = (inputData) => {
        const outputData = {};
        const industries = inputData.filter((input) => input.type === 'industry');
        industries.forEach((industry) => {
            outputData[industry.id] = { ...industry, nodes: [] };
        });
        let tempApps = {};
        let tempFunctions = {};
        let selectedFunctions = [];
        inputData.forEach((inputObj) => {
            if (!tempApps[inputObj['parent_industry_id']]) {
                tempApps[inputObj['parent_industry_id']] = [];
            }
            if (!tempFunctions[inputObj['parent_industry_id']]) {
                tempFunctions[inputObj['parent_industry_id']] = [];
            }
            if (outputData[inputObj['parent_industry_id']]) {
                switch (inputObj.type) {
                    case 'function':
                        outputData[inputObj['parent_industry_id']].nodes.push(inputObj);
                        selectedFunctions.push(inputObj.id);
                        tempFunctions[inputObj['parent_industry_id']].push(inputObj);
                        break;
                    case 'application':
                        outputData[inputObj['parent_industry_id']].nodes.push(inputObj);
                        tempApps[inputObj['parent_industry_id']].push(inputObj);
                        break;
                }
            }
        });
        setFunctions(tempFunctions);
        setApps(tempApps);
        setSelectedFunctions(selectedFunctions);
        return outputData;
    };

    const getData = async () => {
        try {
            const responseData = await getHierarchy({ dashboardId: props.dashboardId });
            if (!Object.entries(data).length) {
                setData(formatData(responseData.result));
            }
        } catch (err) {
            // console.error(`Error: Dashboard with id ${props.dashboardId} not found.`);
        }
    };

    useEffect(() => {
        const isAllClosed = Object.values(isOpenObj).every((isOpen) => !isOpen);

        setAllClose(isAllClosed);
        isAllClosed ? setOpenIndex(1000) : null;
    }, [isOpenObj]);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const w = [];
        const h = [];

        for (let i = 0; i < Object.entries(data).length; i++) {
            h.push(50 + i * 20);
            w.push(50 + i * 20);
            initOpen[Object.entries(data)[i][1].node_id] = false;
        }

        setWidth(w);
        setHeight(h);
        setOpen(initOpen);

        const indexMapping = {};
        // eslint-disable-next-line no-unused-vars
        Object.entries(data).forEach(([id, industryDetails], index) => {
            indexMapping[industryDetails.node_id] = index;
        });
        setNodeToIndexMapping(indexMapping);
    }, [data]);

    useEffect(() => {
        if (currentLayerId) {
            const [receivedNodes, receivedEdges] = transformNodesEdges(
                data[currentLayerId]['nodes'],
                openIndex,
                viewApps
            );
            setNodes(receivedNodes);
            setEdges(receivedEdges);
        }
    }, [currentLayerId]);

    const handleClick = (id, index, nodeId, e) => {
        let newOpenObj = {};
        let newWidths = widths;
        let newHeights = heights;
        let keys = Object.keys(isOpenObj);
        setCurrentPage(0);
        // setViewApps(false);
        // setTimeout(() => {
        //     setNodesDisplay('none');
        // }, 500);
        // else {
        //     if (!viewApps) {
        //         setTimeout(() => {
        //             setNodesDisplay('none');
        //         }, 500);
        //     }
        // }

        if (id == currentLayerId) {
            functions[id].map((node) => {
                selectedFunctions.includes(Number(node.id))
                    ? null
                    : setTimeout(() => {
                          setNodesDisplay('none', node.id);
                      }, 50);
            });
        }

        if (e.target.tagName.toLowerCase() !== 'a') {
            if (data[id].nodes.length) {
                keys.forEach((key) => {
                    if (key != nodeId) {
                        newOpenObj[key] = false;
                        if (isOpenObj[key]) {
                            newWidths = getSize(newWidths, nodeToIndexMapping[key], isOpenObj[key]);
                            newHeights = getSize(
                                newHeights,
                                nodeToIndexMapping[key],
                                isOpenObj[key]
                            );
                        }
                    } else if (key == nodeId) {
                        newOpenObj[key] = !isOpenObj[key];
                    }
                });

                setOpen(newOpenObj);
                setOpenIndex(index - 1);
                setCurrentLayerId(id);

                const updatedWidths = getSize(newWidths, index - 1, isOpenObj[nodeId]);
                const updatedHeights = getSize(newHeights, index - 1, isOpenObj[nodeId]);

                setWidth(updatedWidths);
                setHeight(updatedHeights);
            }
            // document
            //     .getElementById(`layer_${id}`)
            //     .addEventListener('mousemove', function moveCursor(event) {
            //         if (
            //             event.clientY > 150 &&
            //             event.clientX > 1100 &&
            //             event.clientX <
            //                 document.getElementById(`layer_${id}`).getBoundingClientRect().right -
            //                     65
            //         ) {
            //             if (document.getElementById('viewApps')) {
            //                 document.getElementById('viewApps').style.display = `inline-flex`;
            //                 document.getElementById(`layer_${id}`).style.cursor = 'pointer';
            //                 document.getElementById('viewApps').style.left = `${
            //                     event.clientX - 10
            //                 }px`;
            //                 document.getElementById('viewApps').style.top = `${
            //                     event.clientY - 10
            //                 }px`;
            //             }
            //         } else {
            //             if (document.getElementById('viewApps')) {
            //                 document.getElementById('viewApps').style.display = `none`;
            //             }
            //         }
            //     });
        }
    };

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = () => {
        let searchInputElement = document.getElementById('searchInput');
        let searchInputIcon = document.getElementById('searchIcon');
        if (searchInputElement.style.visibility == 'visible') {
            let searchSuccess = false;
            for (const [key, value] of Object.entries(data)) {
                value.nodes.forEach(function (value) {
                    if (value['label'].toLowerCase().trim() == searchInput.toLowerCase().trim()) {
                        document.getElementById(`layer_${key}`).click();
                        searchSuccess = true;
                    }
                });
            }
            if (!searchSuccess) {
                for (const [key, value] of Object.entries(apps)) {
                    value.forEach(function (value) {
                        if (
                            value['label'].toLowerCase().trim() == searchInput.toLowerCase().trim()
                        ) {
                            document.getElementById(`layer_${key}`).click();
                        }
                    });
                }
            }
        } else {
            searchInputIcon.style.border = 'none';
            searchInputIcon.style.padding = '0rem';
            searchInputIcon.style.left = 10;
            searchInputElement.style.visibility = 'visible';
            searchInputElement.style.opacity = 1;
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };
    const setNodesAndEdges = (data, openIndex, viewApps) => {
        const [receivedNodes, receivedEdges] = transformNodesEdges(
            data,
            openIndex,
            viewApps,
            currentLayerId
        );
        setNodes(receivedNodes);
        setEdges(receivedEdges);
    };

    const setNodesDisplay = (value, id) => {
        const nodeElements = id
            ? document.querySelectorAll(`[data-nodeid="${id}"]`)
            : document.querySelectorAll('.react-flow__handle');
        nodeElements.forEach((element) => {
            element.style.display = value;
        });
    };

    const getAppsForFunction = (appData, function_id) => {
        let filteredFunctions = [...selectedFunctions];
        selectedFunctions.includes(Number(function_id))
            ? (filteredFunctions = filteredFunctions.filter((item) => item !== Number(function_id)))
            : filteredFunctions.push(Number(function_id));
        setSelectedFunctions(filteredFunctions);
        let filteredData = [];
        appData.map((value) => {
            if (value.type == 'function' || filteredFunctions.includes(value.parent_function_id)) {
                filteredData.push(value);
            }
        });
        return filteredData;
    };

    const displayApps = (id, node) => {
        let startIndex = currentPage * 5;
        let endIndex = currentPage * 5 + 5;
        if (selectedFunctions.length == 0) {
            setNodesDisplay('none');
        }
        // if (viewApps) {
        //     setNodesAndEdges(functions[currentLayerId], openIndex, false);
        //     // setViewApps(false);
        //     setTimeout(() => {
        //         setNodesDisplay('none');
        //     }, 50);
        // } else {
        // setViewApps((viewApps) => !viewApps);
        let appData = JSON.parse(JSON.stringify(functions));
        appData[id] = appData[currentLayerId].slice(startIndex, endIndex).concat(apps[id]);
        setNodesAndEdges(getAppsForFunction(appData[currentLayerId], node.id), openIndex, true);
        selectedFunctions.includes(Number(node.id))
            ? setNodesDisplay('none', node.id)
            : setNodesDisplay('block', node.id);
        // }
    };

    const paginate = (direction) => {
        let page = currentPage;
        let steplength = 5;
        let arrowDownElement = document.getElementById('arrowDown');
        let arrowUpElement = document.getElementById('arrowUp');
        switch (direction) {
            case 'up':
                if (page == 0) {
                    arrowUpElement.style.pointerEvents = 'none';
                    arrowUpElement.style.opacity = 0.5;
                } else {
                    if (viewApps) {
                        let appData = JSON.parse(JSON.stringify(functions));
                        appData[currentLayerId] = appData[currentLayerId]
                            .slice(page * steplength - steplength, page * steplength)
                            .concat(apps[currentLayerId]);
                        setNodesAndEdges(appData[currentLayerId], openIndex, true);
                    } else {
                        setNodesAndEdges(
                            functions[currentLayerId].slice(
                                page * steplength - steplength,
                                page * steplength
                            ),
                            openIndex,
                            false
                        );
                    }
                    page -= 1;
                    if (page * steplength - steplength < 0) {
                        arrowUpElement.style.pointerEvents = 'none';
                        arrowUpElement.style.opacity = 0.5;
                    }
                }
                break;
            case 'down':
                page += 1;
                switch (page * 5 < functions[currentLayerId].length) {
                    case true:
                        if (viewApps) {
                            let appData = JSON.parse(JSON.stringify(functions));
                            appData[currentLayerId] = appData[currentLayerId]
                                .slice(page * steplength, page * steplength + steplength)
                                .concat(apps[currentLayerId]);
                            setNodesAndEdges(appData[currentLayerId], openIndex, true);
                        } else {
                            setNodesAndEdges(
                                functions[currentLayerId].slice(
                                    page * steplength,
                                    page * steplength + steplength
                                ),
                                openIndex,
                                false
                            );
                        }
                        if (page * steplength + steplength >= functions[currentLayerId].length) {
                            arrowDownElement.style.pointerEvents = 'none';
                            arrowDownElement.style.opacity = 0.5;
                        }
                        break;
                    case false:
                        arrowDownElement.style.pointerEvents = 'none';
                        arrowDownElement.style.opacity = 0.5;
                }
                break;
        }
        setCurrentPage(page);
    };

    const onEndVideo = () => {
        setVideoEnd(true);
    };

    return (
        <Fragment>
            {videoEnd ? (
                <div style={{ background: '#0C2744', width: '100%', height: '100%' }}>
                    <NavBar />
                    <div className={classes.inputHolder}>
                        <SearchIcon
                            id="searchIcon"
                            onClick={handleSearchSubmit}
                            className={classes.searchIcon}
                        />
                        <input
                            onKeyDown={handleKeyDown}
                            onChange={handleInputChange}
                            className={classes.searchInput}
                            id="searchInput"
                            name="search"
                            placeholder="Search Apps or Functions"
                        ></input>
                    </div>
                    {Object.entries(data).map((industryDetails, index) => {
                        const { id, label, node_id: nodeId } = industryDetails[1];
                        let capitalizedLabel = label.toUpperCase();
                        const labelDefaults = getLabelDefaults();
                        const closeDefaults = getCloseDefaults();
                        const retailTextDefaults = getRetailTextDefaults();
                        const functionsLength = functions[currentLayerId]?.length || 0;

                        return (
                            <div
                                key={nodeId}
                                className={`${
                                    !isOpenObj[nodeId] ? classes.wrapperClose : classes.wrapperOpen
                                } ${classes.cicleWrapper}`}
                                onClick={(event) =>
                                    !isOpenObj[nodeId] && handleClick(id, index + 1, nodeId, event)
                                }
                                style={{
                                    width: `${widths[index] * 7}px`,
                                    height: `${heights[index] * 7}px`,
                                    bottom: `${(10 - widths[index] / 2) * 7}px`,
                                    left: `${(10 - widths[index] / 2) * 7}px`,
                                    background: `${bgColors[index + 1] || '#1b6077'}`,
                                    zIndex: `${101 - index + 1}`
                                }}
                                id={`layer_${id}`}
                            >
                                {!isOpenObj[nodeId] ? (
                                    index == 0 ? (
                                        <span
                                            className={classes.initialLabel}
                                            style={{
                                                paddingTop: `${retailTextDefaults[0]}%`,
                                                marginLeft: `${retailTextDefaults[1]}%`,
                                                fontSize: `${retailTextDefaults[2]}rem`
                                            }}
                                        >
                                            RETAIL MEDIA
                                        </span>
                                    ) : index < openIndex ? (
                                        <svg
                                            height={`${500 + index * 20}px`}
                                            width={`${800 + index * 60}px`}
                                        >
                                            <path
                                                id={`curve${index}`}
                                                d={`m ${115 + index * 27} ${
                                                    65 + index * 17
                                                } a 20 20 15 1 1 ${140 + index * 87} ${
                                                    200 + index * 107
                                                }`}
                                                fill="none"
                                            />
                                            <text
                                                className={classes.restCloseLabels}
                                                x={`${
                                                    210 + 100 * index - capitalizedLabel.length * 9
                                                }`}
                                                fontSize={`${20}px`}
                                                style={{ letterSpacing: '3px' }}
                                            >
                                                <textPath href={`#curve${index}`}>
                                                    {capitalizedLabel}
                                                </textPath>
                                            </text>
                                        </svg>
                                    ) : (
                                        <svg
                                            height={`${2450 + index * 20}px`}
                                            width={`${2860 + index * 20}px`}
                                        >
                                            <path
                                                id={`curve${index}`}
                                                d={`m ${340 + index * 68} ${
                                                    230 + index * 40
                                                } a 26 26 50 1 1 ${1475 + index * 55} ${
                                                    1820 + index * 55
                                                }`}
                                                fill="none"
                                            />
                                            <text
                                                className={classes.restCloseLabels}
                                                x={`${
                                                    2260 +
                                                    index * 100 -
                                                    capitalizedLabel.length * 10
                                                }`}
                                                fontSize={`${20}px`}
                                                style={{ letterSpacing: '3px' }}
                                            >
                                                <textPath href={`#curve${index}`}>
                                                    {capitalizedLabel}
                                                </textPath>
                                            </text>
                                        </svg>
                                    )
                                ) : (
                                    <Fragment>
                                        <ReactFlow
                                            nodes={nodes}
                                            edges={edges}
                                            onNodesChange={onNodesChange}
                                            onEdgesChange={onEdgesChange}
                                            onConnect={onConnect}
                                            onInit={onInit}
                                            minZoom={getFlowZoom()}
                                            zoomOnScroll={false}
                                            zoomOnDoubleClick={false}
                                            onNodeClick={(event, node) => displayApps(id, node)}
                                            style={{
                                                width: devicePixelRatio === 1 ? '92%' : '95%'
                                            }}
                                        >
                                            <Controls />
                                        </ReactFlow>

                                        <span
                                            style={{
                                                position: 'absolute',
                                                left: `${labelDefaults[0] + index * 65}px`,
                                                bottom: `${labelDefaults[1] + index * 80}px`
                                            }}
                                            className={classes.openLabels}
                                        >
                                            {capitalizedLabel}
                                        </span>
                                        <IconButton
                                            onClick={(event) =>
                                                handleClick(id, index + 1, nodeId, event)
                                            }
                                            style={{
                                                zIndex: 1000,
                                                left: `${closeDefaults[0] + index * 100}px`,
                                                bottom: `${closeDefaults[1] + index * 78}px`
                                            }}
                                        >
                                            <HighlightOffIcon className={classes.paginationIcons} />
                                        </IconButton>
                                        {/* <span
                                            onClick={() => displayApps(id)}
                                            className={classes.viewAppStyles}
                                            id="viewApps"
                                        >
                                            {!viewApps ? 'VIEW APPS' : 'BACK'}
                                        </span> */}
                                        {viewApps && functionsLength > 5 ? (
                                            <div className={classes.paginationHolder}>
                                                {!(currentPage === 0) && (
                                                    <IconButton
                                                        id="arrowUp"
                                                        className={
                                                            currentPage == 0
                                                                ? classes.paginateDisableIcons
                                                                : classes.paginateEnableIcons
                                                        }
                                                        onClick={() => paginate('up')}
                                                    >
                                                        <KeyboardArrowUp
                                                            className={classes.paginationIcons}
                                                        />
                                                    </IconButton>
                                                )}
                                                <span className={classes.paginationText}>
                                                    {currentPage * 5 + 1} -{' '}
                                                    {currentPage * 5 + 5 > functionsLength
                                                        ? functionsLength
                                                        : currentPage * 5 + 5}{' '}
                                                    of {functionsLength}
                                                </span>
                                                {!(currentPage + 1 >= functionsLength / 5) && (
                                                    <IconButton
                                                        id="arrowDown"
                                                        className={
                                                            currentPage + 1 >= functionsLength / 5
                                                                ? classes.paginateDisableIcons
                                                                : classes.paginateEnableIcons
                                                        }
                                                        onClick={() => paginate('down')}
                                                    >
                                                        <KeyboardArrowDown
                                                            className={classes.paginationIcons}
                                                        />
                                                    </IconButton>
                                                )}
                                            </div>
                                        ) : null}
                                    </Fragment>
                                )}
                            </div>
                        );
                    })}
                    {allClose && (
                        <div className={classes.standardText}>
                            <span className={classes.textBody1}>GET MORE OUT OF </span>
                            <span className={classes.textBody2}>RETAIL MEDIA</span>
                            <br /> <br />
                            <span className={classes.textBody2}>THAN EVER BEFORE</span>
                            <br /> <br />
                            <span className={classes.textBody3}>
                                The simplicity of your new media network, built on the CoDx
                            </span>
                            <br />
                            <span className={classes.textBody3}>
                                platform is a big win for you and your brand partners.
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <video
                    onEnded={onEndVideo}
                    className={classes.videoStyles}
                    key={'video-retailmedia'}
                    preload="auto"
                    autoPlay
                    muted
                >
                    <source
                        src={`${
                            import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                        }/codx-animations/Retail-Media-Landing-Page-Animation.mp4`}
                        type="video/mp4"
                    />
                </video>
            )}
        </Fragment>
    );
}
