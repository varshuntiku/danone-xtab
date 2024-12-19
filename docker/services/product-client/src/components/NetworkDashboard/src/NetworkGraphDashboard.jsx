import React from 'react';
import Graph from 'react-graph-vis';
import { useState, useEffect, useRef } from 'react';
import { healthCareIcons } from '../../Healthcaredashboard/data';
import LeftMenu from './Leftmenu/Leftmenu';
import { getHierarchy } from '../../../services/dashboard';
import { DashboardSpecs } from '../../../assets/data/dashboardSpecs';
import { makeStyles, useTheme } from '@material-ui/core';
import DefaultIcon from '../../../assets/img/DefaultIcon.svg';
import './Pophover.css';
const useStyles = makeStyles((theme) => ({
    f1: {
        fontWeight: '1.6rem'
    },
    actionContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '1rem',
        height: 'fit-content',
        alignitems: 'flex-end'
    },
    homeHexagon: {
        backgroundColor: 'blue'
    },
    vis: {
        display: 'flex'
    },
    tableView: {
        padding: '2.5rem'
    },
    healthCareContainer: {
        display: 'flex'
        // backgroundColor:localStorage.getItem("codx-products-theme")==="dark"? "#0C2744" : "#fcfcfc",
    },
    container: {
        // border: "1px dashed",
        // borderRadius: "5px",
        // borderColor: theme.palette.primary.contrastText + "cc",
        display: 'flex',
        marginLeft: '50px'
    },
    popover: {
        padding: '0.3rem',
        maxWidth: '18rem',
        textAlign: 'center',
        height: 'fit-content',
        fontSize: '1.7rem',
        fontWeight: 'regular',
        borderRadius: '0.5rem',
        border: '0.05rem solid ',
        borderColor: theme.HealthCareDashboard.PopoverBorder,
        backgroundColor: theme.HealthCareDashboard.PopoverFill,
        color:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? theme.HealthCareDashboard.White
                : theme.HealthCareDashboard.Black
    }
}));
export function PascalCase(str) {
    let inner = str.split(' ');
    const newStr = inner.map((el) => {
        return el[0].toUpperCase() + el.substring(1);
    });
    return newStr.join(' ');
}

export default function Structure({ section, setTableJson, dashboardId }) {
    let rootLabel;
    const theme = useTheme();
    const classes = useStyles();
    const [two, setTwo] = useState({ nodes: [], edges: [] });
    const bodyRef = useRef(null);
    const fetchlogoRef = useRef('');
    const codexTheme = localStorage.getItem('codx-products-theme');
    const defaultData = {
        nodes: [],
        edges: []
    };
    const [render, setRender] = useState(defaultData);
    const [menu, setMenu] = useState(null);
    const [apiData, setApiData] = useState([]);
    const [initialData, setInitialData] = useState({});
    //html for popover;
    function htmlTitle(html) {
        const container = document.createElement('div');
        container.innerText = html;
        container.className = classes.popover;
        return container;
    }
    //getting shapes
    function nodeShape(nodetype) {
        let shape;
        switch (nodetype) {
            case 'root':
                shape = 'custom';
                break;
            case 'category':
                shape = 'custom';
                break;
            case 'industry':
                shape = 'custom';
                break;
            case 'function':
                shape = 'box';
                break;
            case 'subfunction':
                shape = 'box';
                break;
            case 'application':
                shape = 'custom';
                break;
            default:
                shape = 'box';
        }
        return shape;
    }
    // api call function
    const getData = async () => {
        try {
            const result = await getHierarchy({ dashboardId });
            const required_data = [];
            for (let node of result.result) {
                if (node.type === 'application') {
                    let shape = nodeShape(node.level ? node.level : node.type);
                    let parent_id;
                    if (
                        node.parent_function_id ||
                        (node.parent_function_id && node.parent_industry_id)
                    ) {
                        let id = node.parent_function_id;
                        parent_id =
                            result.result.filter((item) => item.id === id).length > 0
                                ? result.result.filter(
                                      (item) => item.id === id && item.type === 'function'
                                  )[0].node_id
                                : null;
                    } else {
                        let id = node.parent_industry_id;
                        parent_id = result.result.filter((item) => item.id === id)[0].node_id;
                    }

                    required_data.push({
                        id: node.node_id,
                        label: node.label,
                        parent_id: parent_id,
                        group: node.level ? node.level : node.type,
                        color:
                            shape === 'box' || shape === 'text'
                                ? {
                                      border: node.color,
                                      background:
                                          localStorage.getItem('codx-products-theme') === 'dark'
                                              ? theme.HealthCareDashboard.BackgroundDark
                                              : theme.HealthCareDashboard.BackgroundLight
                                  }
                                : node.color,
                        actual_id: node.id,
                        title: node.description ? htmlTitle(node.description) : null,
                        shape: node.level ? nodeShape(node.level) : nodeShape(node.type)
                    });
                } else if (node.type === 'industry') {
                    let shape = nodeShape(node.level ? node.level : node.type);
                    let parent_id;
                    parent_id =
                        result.result.filter((item) => item.id === node.parent_industry_id).length >
                        0
                            ? result.result.filter((item) => item.id === node.parent_industry_id)[0]
                                  .node_id
                            : null;
                    required_data.push({
                        id: node.node_id,
                        label: node.label,
                        parent_id: parent_id,
                        logo_name: node.logo_name,
                        group: node.level ? node.level : node.type,
                        color:
                            shape === 'box'
                                ? {
                                      border: node.color,
                                      background:
                                          localStorage.getItem('codx-products-theme') === 'dark'
                                              ? theme.HealthCareDashboard.BackgroundDark
                                              : theme.HealthCareDashboard.BackgroundLight
                                  }
                                : node.color,
                        actual_id: node.id,
                        title: node.description ? htmlTitle(node.description) : null,
                        shape: node.level ? nodeShape(node.level) : nodeShape(node.type)
                    });
                } else if (node.type === 'function') {
                    let shape = nodeShape(node.level ? node.level : node.type);
                    let parent_id;
                    if (node.parent_industry_id && node.parent_function_id) {
                        parent_id = result.result.filter(
                            (item) => item.id === node.parent_function_id
                        )[0].node_id;
                    } else {
                        parent_id = result.result.filter(
                            (item) => item.id === node.parent_industry_id
                        )[0].node_id;
                    }
                    required_data.push({
                        id: node.node_id,
                        label: node.label,
                        parent_id: parent_id,
                        logo_name: node.logo_name,
                        group: node.level ? node.level : node.type,
                        color:
                            shape === 'box'
                                ? {
                                      border: node.color,
                                      background:
                                          localStorage.getItem('codx-products-theme') === 'dark'
                                              ? theme.HealthCareDashboard.BackgroundDark
                                              : theme.HealthCareDashboard.BackgroundLight
                                  }
                                : node.color,
                        actual_id: node.id,
                        title: node.description ? htmlTitle(node.description) : null,
                        shape: node.level ? nodeShape(node.level) : nodeShape(node.type)
                    });
                }
            }
            const rootNode = required_data.filter((el) => el.parent_id === null);
            rootLabel = rootNode[0].label;
            rootNode[0].shape = 'custom';
            const rootChildes = required_data.filter((el) => el.parent_id === rootNode[0].id);
            const nodes = [rootNode[0]];
            const edges = [];
            for (let node of rootChildes) {
                nodes.push({
                    id: node.id,
                    label: ` ${node.label} `,
                    color: node.color,
                    shape: node.shape,
                    group: node.group,
                    title: node.title
                });
                edges.push({
                    from: rootNode[0].id,
                    to: node.id,
                    color:
                        codexTheme === 'dark'
                            ? theme.palette.primary.contrastText
                            : theme.HealthCareDashboard.edgelineLight
                });
            }
            setApiData(required_data);
            setRender({ ...defaultData, nodes: nodes, edges: edges });
            setTwo({ ...defaultData, nodes: nodes, edges: edges });
            setInitialData({ ...defaultData, nodes: nodes, edges: edges });
        } catch (err) {
            // TODO
        }
    };
    // function for generating table josn
    function genrateJson() {
        const tableJsonData = {};
        const rootNode = apiData.filter((el) => el.parent_id === null)[0];
        const categories = apiData.filter((el) => el.parent_id === rootNode.id);
        function getChildes(id) {
            const childs = apiData.filter((el) => el.parent_id === id);
            return childs;
        }
        let rows = categories.map((item) => {
            const object = {
                collapse: false,
                data: {}
            };
            const childrens = getChildes(item.id);
            tableJsonData['columns'] = [
                { id: false, label: '' },
                { id: 'category', label: 'Category' }
            ];
            object['category'] = item.label;
            if (childrens.length > 0) {
                object['collapse'] = true;
            }
            let industry = getChildes(item.id);
            object['data']['columns'] = [
                { id: false, label: '' },
                { id: 'industry', label: 'Industry' },
                { id: 'description', label: 'Description' }
            ];
            object['data']['rows'] = [];
            industry.map((el) =>
                object['data']['rows'].push({
                    industry: el.label,
                    description: el.title ? el.title.innerText : ''
                })
            );
            industry.map((ind, i) => {
                let baseObject = object['data']['rows'][i];
                let functions = getChildes(ind.id);
                if (functions.length > 0) {
                    baseObject['collapse'] = true;
                    baseObject['data'] = {};
                    baseObject['data']['columns'] = [
                        { id: false, label: '' },
                        { id: 'function', label: 'Function' },
                        { id: 'description', label: 'Description' }
                    ];
                    baseObject['data']['rows'] = [];
                    functions.map((el) =>
                        baseObject['data']['rows'].push({
                            function: el.label,
                            description: el.title ? el.title.innerText : ''
                        })
                    );
                    functions.map((fun, index) => {
                        let subfunction = getChildes(fun.id);
                        if (subfunction.length > 0) {
                            baseObject['data']['rows'][index]['collapse'] = true;
                            baseObject['data']['rows'][index]['data'] = {};
                            baseObject['data']['rows'][index]['data']['columns'] = [
                                { id: false, label: '' },
                                { id: 'subfunction', label: 'Subfunction' },
                                { id: 'description', label: 'Description' }
                            ];
                            baseObject['data']['rows'][index]['data']['rows'] = [];
                            subfunction.map((el) =>
                                baseObject['data']['rows'][index]['data']['rows'].push({
                                    subfunction: el.label,
                                    description: el.title ? el.title.innerText : ''
                                })
                            );
                            subfunction.map((elm, i) => {
                                let application = getChildes(elm.id);
                                if (application.length > 0) {
                                    baseObject['data']['rows'][index]['data']['rows'][i][
                                        'collapse'
                                    ] = true;
                                    baseObject['data']['rows'][index]['data']['rows'][i]['data'] =
                                        {};
                                    baseObject['data']['rows'][index]['data']['rows'][i]['data'][
                                        'columns'
                                    ] = [
                                        { id: false, label: '' },
                                        { id: 'application', label: 'Application' },
                                        { id: 'description', label: 'Description' }
                                    ];
                                    baseObject['data']['rows'][index]['data']['rows'][i]['data'][
                                        'rows'
                                    ] = [];
                                    application.map((el) =>
                                        baseObject['data']['rows'][index]['data']['rows'][i][
                                            'data'
                                        ]['rows'].push({
                                            application: el.label,
                                            description: el.title ? el.title.innerText : ''
                                        })
                                    );
                                }
                            });
                        }
                    });
                }
            });
            return object;
        });
        tableJsonData['rows'] = rows;
        setTableJson(tableJsonData);
    }
    // end of function
    function FetchLogoname(id) {
        if (apiData?.length) {
            const logo_name = apiData?.filter((item) => item.id === id)[0]?.logo_name;
            return logo_name;
        }
    }

    const options = {
        groups: {
            //groups for differntiating the levels on UI
            // useDefaultGroups: true,
            root: {
                ctxRenderer: ({ ctx, x, y, style, label }) => {
                    const themes = localStorage.getItem('codx-products-theme');
                    style.cursor = 'cursor';
                    const img = new Image();
                    if (typeof DashboardSpecs[fetchlogoRef.current] === 'string') {
                        img.src = DashboardSpecs[fetchlogoRef.current];
                    } else {
                        img.src = DefaultIcon;
                    }
                    const a = (2 * Math.PI) / 6;
                    let r;
                    // eslint-disable-next-line no-unused-vars
                    let fillColor;
                    let strokeColor =
                        themes === 'dark'
                            ? theme.palette.primary.contrastText
                            : theme.HealthCareDashboard.edgelineLight;
                    // eslint-disable-next-line no-unused-vars
                    let text;
                    let bg =
                        themes === 'dark'
                            ? theme.palette.primary.dark
                            : theme.HealthCareDashboard.BackgroundLight;
                    if (label === rootLabel) {
                        // eslint-disable-next-line no-unused-vars
                        text = '';
                    } else {
                        // eslint-disable-next-line no-unused-vars
                        text = label;
                    }
                    if (label === rootLabel) {
                        r = 80;
                        // eslint-disable-next-line no-unused-vars
                        fillColor = bg;
                    } else {
                        r = 60;
                        // eslint-disable-next-line no-unused-vars
                        fillColor = style.color;
                    }

                    return {
                        drawNode() {
                            ctx.beginPath();
                            for (let i = 0; i < 6; i++) {
                                ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
                            }
                            ctx.closePath();
                            // Changed this to bg color fixes edges.
                            ctx.fillStyle = bg;
                            ctx.fill();
                            ctx.strokeStyle = strokeColor;
                            ctx.stroke();
                            ctx.drawImage(img, x - 20, y - 20, 40, 40);
                            ctx.fillStyle = 'black';
                            ctx.font = '13px Arial';
                            ctx.textAlign = 'start';
                            ctx.stroke();
                            if (!healthCareIcons[label.trim()]) {
                                ctx.fillStyle = 'black';
                                ctx.fillText(label, x - 20, y + 30);
                            }
                        },

                        drawExternalLabel() {
                            ctx.fillStyle =
                                themes === 'dark'
                                    ? theme.HealthCareDashboard.BackgroundDark + '88'
                                    : theme.HealthCareDashboard.White + '88';
                            let yVal = label === rootLabel ? 75 : 60;
                            label.length < 12
                                ? ctx.fillRect(x - 50, y + yVal, 90, 20)
                                : ctx.fillRect(x - 80, y + yVal, 140, 20);
                            let string = PascalCase(label.trim());
                            ctx.fillStyle =
                                themes === 'dark'
                                    ? theme.HealthCareDashboard.labelDark
                                    : theme.HealthCareDashboard.edgelineLight;
                            ctx.font = ' bold 16px Roboto';
                            ctx.textAlign = 'center';
                            label === rootLabel
                                ? ctx.fillText(string, x - 5, y + 90)
                                : ctx.fillText(string, x - 5, y + 75);
                        }
                    };
                }
            },
            category: {
                nodes: {
                    chosen: {
                        node: false
                    }
                },

                ctxRenderer: ({ ctx, x, y, style, label }) => {
                    const img = new Image();
                    if (typeof DashboardSpecs[fetchlogoRef.current] === 'string') {
                        img.src = DashboardSpecs[fetchlogoRef.current];
                    } else {
                        img.src = DefaultIcon;
                    }
                    const a = (2 * Math.PI) / 6;
                    let r;
                    // eslint-disable-next-line no-unused-vars
                    let fillColor;
                    let strokeColor;
                    // eslint-disable-next-line no-unused-vars
                    let text;
                    const themes = localStorage.getItem('codx-products-theme');
                    let bg =
                        themes === 'dark'
                            ? theme.HealthCareDashboard.RootBg
                            : theme.HealthCareDashboard.BackgroundLight;
                    let opacity = '66';
                    if (label === rootLabel) {
                        // eslint-disable-next-line no-unused-vars
                        text = '';
                    } else {
                        // eslint-disable-next-line no-unused-vars
                        text = label;
                    }
                    if (label === rootLabel) {
                        r = 80;
                        // eslint-disable-next-line no-unused-vars
                        fillColor = bg;
                    } else {
                        r = 60;
                        // eslint-disable-next-line no-unused-vars
                        fillColor = style.color;
                    }
                    strokeColor = style.color;
                    let ir = 52;
                    let OpacityColor = style.color + opacity;
                    return {
                        drawNode() {
                            ctx.beginPath();
                            for (let i = 0; i < 6; i++) {
                                ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
                            }
                            ctx.closePath();
                            // Changed this to bg color fixes edges.
                            ctx.fillStyle = bg;
                            ctx.fill();
                            ctx.strokeStyle = strokeColor;
                            ctx.stroke();
                            ctx.drawImage(img, x - 20, y - 20, 40, 40);
                            ctx.fillStyle = 'black';
                            ctx.font = '13px Roboto';
                            ctx.textAlign = 'start';
                            ctx.stroke();
                            ctx.beginPath();
                            for (let i = 0; i < 6; i++) {
                                ctx.lineTo(x + ir * Math.cos(a * i), y + ir * Math.sin(a * i));
                            }
                            ctx.closePath();
                            // Removing this as stroke is not needed
                            // ctx.strokeStyle = OpacityColor;
                            // ctx.stroke();
                            ctx.fillStyle = OpacityColor;
                            ctx.fill();
                        },

                        drawExternalLabel() {
                            ctx.fillStyle =
                                themes === 'dark'
                                    ? theme.HealthCareDashboard.BackgroundDark + '88'
                                    : theme.HealthCareDashboard.White + '88';
                            let yVal = label === rootLabel ? 75 : 60;
                            label.length < 12
                                ? ctx.fillRect(x - 50, y + yVal, 90, 20)
                                : ctx.fillRect(x - 80, y + yVal, 140, 20);
                            let string = PascalCase(label.trim());
                            ctx.fillStyle =
                                themes === 'dark'
                                    ? theme.HealthCareDashboard.labelDark
                                    : theme.HealthCareDashboard.edgelineLight;
                            ctx.font = ' bold 16px Roboto';
                            ctx.textAlign = 'center';
                            label === rootLabel
                                ? ctx.fillText(string, x - 5, y + 90)
                                : ctx.fillText(string, x - 5, y + 75);
                        }
                    };
                }
            },
            industry: {
                ctxRenderer: ({ ctx, x, y, style, label }) => {
                    style.cursor = 'pointer';
                    const img = new Image();

                    if (typeof DashboardSpecs[fetchlogoRef.current] === 'string') {
                        img.src = DashboardSpecs[fetchlogoRef.current];
                    } else {
                        img.src = DefaultIcon;
                    }
                    // img.style.stroke="white"
                    // img.style.strokeWidth="3px"
                    // img.classList.add(".svgIcon")
                    const a = (2 * Math.PI) / 6;
                    let r;
                    // eslint-disable-next-line no-unused-vars
                    let fillColor;
                    let strokeColor;
                    // eslint-disable-next-line no-unused-vars
                    let text;
                    const themes = localStorage.getItem('codx-products-theme');
                    let bg =
                        themes === 'dark'
                            ? theme.HealthCareDashboard.RootBg
                            : theme.HealthCareDashboard.BackgroundLight;
                    if (label === rootLabel) {
                        // eslint-disable-next-line no-unused-vars
                        text = '';
                    } else {
                        // eslint-disable-next-line no-unused-vars
                        text = label;
                    }
                    if (label === rootLabel) {
                        r = 80;
                        // eslint-disable-next-line no-unused-vars
                        fillColor = bg;
                    } else {
                        r = 60;
                        // eslint-disable-next-line no-unused-vars
                        fillColor = style.color;
                    }
                    strokeColor = style.color;
                    return {
                        drawNode() {
                            ctx.beginPath();
                            for (let i = 0; i < 6; i++) {
                                ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
                            }
                            ctx.closePath();
                            // Changed this to bg color fixes edges.
                            ctx.fillStyle = bg;
                            ctx.fill();
                            ctx.strokeStyle = strokeColor;
                            ctx.stroke();
                            ctx.drawImage(img, x - 20, y - 20, 40, 40);
                            ctx.fillStyle = 'black';
                            ctx.font = '13px Roboto';
                            ctx.textAlign = 'start';
                            ctx.stroke();
                        },
                        drawExternalLabel() {
                            ctx.fillStyle =
                                themes === 'dark'
                                    ? theme.HealthCareDashboard.BackgroundDark + '88'
                                    : theme.HealthCareDashboard.White + '88';
                            let yVal = label === rootLabel ? 75 : 60;
                            label.length < 12
                                ? ctx.fillRect(x - 50, y + yVal, 90, 20)
                                : ctx.fillRect(x - 80, y + yVal, 140, 20);
                            let string = PascalCase(label.trim());
                            ctx.fillStyle =
                                themes === 'dark'
                                    ? theme.HealthCareDashboard.labelDark
                                    : theme.HealthCareDashboard.edgelineLight;
                            ctx.font = ' bold 16px Roboto';
                            ctx.textAlign = 'center';
                            label === rootLabel
                                ? ctx.fillText(string, x - 5, y + 90)
                                : ctx.fillText(string, x - 5, y + 75);
                        }
                    };
                }
            },
            function: {
                shape: 'box',
                margin: 15,
                color: {
                    background:
                        localStorage.getItem('codx-products-theme') === 'dark'
                            ? theme.HealthCareDashboard.BackgroundDark
                            : theme.HealthCareDashboard.BackgroundLight
                },
                font: {
                    color:
                        localStorage.getItem('codx-products-theme') === 'dark'
                            ? theme.HealthCareDashboard.White
                            : theme.HealthCareDashboard.Black
                }
            },
            subfunction: {
                shape: 'box',
                margin: 5,
                shapeProperties: { borderDashes: [5, 5] },
                color: {
                    background:
                        localStorage.getItem('codx-products-theme') === 'dark'
                            ? theme.HealthCareDashboard.BackgroundDark
                            : theme.HealthCareDashboard.BackgroundLight
                },
                font: {
                    color:
                        localStorage.getItem('codx-products-theme') === 'dark'
                            ? theme.HealthCareDashboard.White
                            : theme.HealthCareDashboard.Black
                }
            },
            application: {
                ctxRenderer: ({ ctx, id, x, y, label }) => {
                    const themes = localStorage.getItem('codx-products-theme');
                    const parentColor = apiData.filter(
                        (el) => el.id === apiData.filter((el) => el.id === id)[0].parent_id
                    )[0];
                    let dotColor;
                    if (typeof parentColor.color === 'object') {
                        dotColor = parentColor.color.border;
                    } else if (parentColor.color === 'string') {
                        dotColor = parentColor.color;
                    }
                    if (dotColor === null || undefined || '') {
                        dotColor =
                            themes === 'dark'
                                ? theme.HealthCareDashboard.White
                                : theme.HealthCareDashboard.edgelineLight;
                    }
                    return {
                        drawNode() {
                            ctx.beginPath();
                            ctx.arc(x, y, 8, 0, 2 * Math.PI);
                            ctx.fillStyle = dotColor;
                            ctx.fill();
                            let len = ctx.measureText(label).width;
                            ctx.fillStyle =
                                themes === 'dark'
                                    ? theme.HealthCareDashboard.BackgroundDark + '88'
                                    : theme.HealthCareDashboard.White + '88';
                            ctx.fillRect(x - len / 2, y + 18, len, 18);
                            ctx.font = ' bold 16px Roboto';
                            ctx.fillStyle =
                                themes === 'dark'
                                    ? theme.HealthCareDashboard.labelDark
                                    : theme.HealthCareDashboard.edgelineLight;
                            ctx.fillText(label, x - len / 2, y + 27);
                        }
                    };
                }
            }
        },
        edges: {
            color:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? theme.HealthCareDashboard.White
                    : theme.HealthCareDashboard.edgelineLight,
            length: 200,
            width: 2,
            arrowStrikethrough: true,
            arrows: {
                to: {
                    enabled: false
                }
            },
            smooth: {
                enabled: true,
                type: 'cubicBezier',
                roundness: 0,
                forceDirection: 'horizontal'
            }
        },
        nodes: {
            chosen: false
        },
        layout: {
            randomSeed: 5,
            hierarchical: {
                enabled: false,
                // improvedLayout:true,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'hubsize',
                levelSeparation: 300
            }
        },
        physics: {
            // Even though it's disabled the options still apply to network.stabilize().
            enabled: true,
            solver: 'forceAtlas2Based',
            repulsion: {
                nodeDistance: 200,
                centralGravity: 0,
                springLength: 95,
                springConstant: 0.05
            },
            barnesHut: {
                theta: 0.5,
                centralGravity: 0,
                springLength: 100,
                gravitationalConstant: -50000,
                springConstant: 0.04,
                damping: 0.5,
                avoidOverlap: 1
            },
            forceAtlas2Based: {
                theta: 0.5,
                gravitationalConstant: section === 'heirarcy' ? -800 : -900,
                centralGravity: 0.01,
                springConstant: 0.05,
                springLength: 100,
                damping: 1,
                avoidOverlap: 0
            },
            maxVelocity: 15,
            minVelocity: 2,
            stabilization: {
                enabled: true,
                iterations: 200,
                updateInterval: 100,
                onlyDynamicEdges: false,
                fit: true
            },
            timestep: 0.5,
            adaptiveTimestep: true,
            wind: { x: 0, y: 0 }
        },
        interaction: {
            // hover: true,
            // hoverConnectedEdges: true
        }
    };
    const toglingNode = (currNode) => {
        //recursive function for getting the hierarcy for nodes
        let stack = [];
        function recurssion(node) {
            let result = apiData.filter((el) => el.parent_id === node);
            if (result.length > 0) {
                for (let y of result) {
                    stack.push(y);
                }
                for (let x of result) {
                    recurssion(x.id);
                }
            }
        }
        recurssion(currNode);
        return stack;
    };

    const showChildrens = (node) => {
        //function for handling first grpah
        if (node === initialData.nodes[0].id) {
            setMenu(initialData.nodes[0]);
            setRender(initialData);
            return;
        }
        // get type of node , if its Function then dont push application into Nodes array. If its subfunction then push application
        // into nodes array
        //    node all subfunction children , then creatre edge array from all sub fun to eaach app
        const rootNode = apiData.filter((item) => item.parent_id === null);
        const presentNode = apiData.filter((item) => item.id === node);
        const nodeChilds = apiData.filter((item) => item.parent_id === node);
        const childOpen = render.edges.find((el) => el.from === node);
        if (presentNode[0].group === 'category') {
            setMenu(presentNode[0]);
            let N = [...render.nodes];
            const E = [...render.edges];
            const selectedCategory = apiData.filter((el) => el.id === presentNode[0].parent_id);
            selectedCategory[0].shape = 'custom';
            presentNode[0].shape = 'custom';
            N = [rootNode[0], presentNode[0]];
            const categoryChildes = apiData.filter((el) => el.parent_id === node);
            for (let n of categoryChildes) {
                N.push({
                    id: n.id,
                    label: ` ${n.label} `,
                    color: n.color,
                    shape: n.shape,
                    group: n.group,
                    title: n.title
                });
                E.push({
                    from: node,
                    to: n.id,
                    color: typeof n.color === 'object' ? n.color.border : n.color,
                    dashes: true
                });
            }
            setRender(() => ({ nodes: N, edges: E }));
            return;
        }
        if (presentNode[0].group === 'subfunction') {
            if (presentNode[0].parent_id === rootNode[0].id) {
                setMenu(presentNode[0]);
                let N = [...render.nodes];
                const E = [...render.edges];
                const children = apiData.filter((el) => el.parent_id === node);
                N = [rootNode[0], presentNode[0]];
                for (let n of children) {
                    N.push({
                        id: n.id,
                        label: ` ${n.label} `,
                        color: n.color,
                        shape: n.shape,
                        group: n.group,
                        title: n.title
                    });
                    E.push({
                        from: node,
                        to: n.id,
                        color: typeof n.color === 'object' ? n.color.border : n.color,
                        dashes: true
                    });
                }
                setRender(() => ({ nodes: N, edges: E }));
                return;
            }
            let N = [...render.nodes].filter((el) => el.group !== 'application');
            const E = [...render.edges];
            const subfunctionchildren = apiData.filter((el) => el.parent_id === presentNode[0].id);
            for (let n of subfunctionchildren) {
                N.push({
                    id: n.id,
                    label: ` ${n.label} `,
                    color: n.color,
                    font: {
                        color:
                            codexTheme === 'dark'
                                ? theme.HealthCareDashboard.White
                                : theme.HealthCareDashboard.Black,
                        size: 18,
                        align: 'center',
                        bold: true,
                        face: 'Roboto'
                    },
                    borderWidth: 2,
                    shape: n.shape,
                    group: n.group,
                    border: n.color.border,
                    title: n.title
                });
                E.push({
                    from: node,
                    to: n.id,
                    color: typeof n.color === 'object' ? n.color.border : n.color,
                    dashes: true
                });
            }
            setRender(() => ({ nodes: N, edges: E }));
            return;
        }
        //  it Application is clicked , run this code
        if (presentNode[0].group === 'application') {
            window.open(`${window.location.origin}/app/${presentNode[0].actual_id}`);
            return;
        }
        // ______end of applocation  code ___

        if (childOpen) {
            let newNodes = [];
            let result = toglingNode(node);
            if (!result.length) {
                return;
            }
            for (let i = 0; i < render.nodes.length; i++) {
                let status = false;
                for (let j = 0; j < result.length; j++) {
                    if (render.nodes[i].id !== result[j].id) {
                        status = true;
                        continue;
                    } else {
                        status = false;
                        break;
                    }
                }
                if (status) {
                    newNodes.push(render.nodes[i]);
                }
            }
            let newEdges = render.edges.filter((el) => el.from !== node);
            setRender(() => ({ nodes: newNodes, edges: newEdges }));
        } else {
            const selectedCategory = initialData.nodes.filter((el) => el.id === node);
            let N = [...render.nodes];
            const E = [...render.edges];
            const presentNode = apiData.filter((item) => item.id === node);
            if (presentNode[0].group === 'function') {
                //displaying one functions subfunctions on UI
                if (presentNode[0].parent_id === rootNode[0].id) {
                    setMenu(presentNode[0]);
                    let N = [...render.nodes];
                    const E = [...render.edges];
                    const children = apiData.filter((el) => el.parent_id === node);
                    N = [rootNode[0], presentNode[0]];
                    for (let n of children) {
                        N.push({
                            id: n.id,
                            label: ` ${n.label} `,
                            color: n.color,
                            shape: n.shape,
                            group: n.group,
                            title: n.title
                        });
                        E.push({
                            from: node,
                            to: n.id,
                            color: typeof n.color === 'object' ? n.color.border : n.color,
                            dashes: true
                        });
                    }
                    setRender(() => ({ nodes: N, edges: E }));
                    return;
                }
                let newnodes = [...render.nodes].filter((el) => el.group !== 'subfunction');
                let N = newnodes.filter((el) => el.group !== 'application');
                const functionChildrens = apiData.filter(
                    (el) => el.parent_id === presentNode[0].id
                );
                for (let n of functionChildrens) {
                    N.push({
                        id: n.id,
                        label: ` ${n.label} `,
                        color: n.color,
                        font: {
                            color:
                                codexTheme === 'dark'
                                    ? theme.HealthCareDashboard.White
                                    : theme.HealthCareDashboard.Black,
                            size: 18,
                            align: 'center',
                            bold: true,
                            face: 'Roboto'
                        },
                        borderWidth: 2,
                        shape: n.shape,
                        group: n.group,
                        border: n?.color?.border,
                        title: n.title
                    });
                    E.push({
                        from: node,
                        to: n.id,
                        color: typeof n.color === 'object' ? n?.color?.border : n?.color,
                        dashes: true
                    });
                }
                setRender(() => ({ nodes: N, edges: E }));
                return;
            }
            if (selectedCategory.length) {
                N = [rootNode[0], selectedCategory[0]];
            } else {
                N = [...render.nodes];
            }

            if (presentNode[0].group === 'industry') {
                const selectedCategory = apiData.filter((el) => el.id === presentNode[0].parent_id);
                presentNode[0].shape = 'custom';
                N = [rootNode[0], selectedCategory[0], presentNode[0]];
                const industryChildes = apiData.filter((el) => el.parent_id === node);
                for (let n of industryChildes) {
                    N.push({
                        id: n.id,
                        label: ` ${n.label} `,
                        color: n.color,
                        font: {
                            color:
                                codexTheme === 'dark'
                                    ? theme.HealthCareDashboard.White
                                    : theme.HealthCareDashboard.Black,
                            size: 18,
                            face: 'Roboto'
                        },
                        shape: n.shape,
                        group: n.group,
                        title: n.title
                    });
                    E.push({
                        from: node,
                        to: n.id,
                        color: typeof n.color === 'object' ? n.color.border : n.color,
                        dashes: true
                    });
                }
            } else {
                for (let n of nodeChilds) {
                    if (n.group === 'industry') {
                        N.push({
                            id: n.id,
                            label: ` ${n.label} `,
                            color: n.color,
                            shape: n.shape,
                            group: n.group,
                            title: n.title
                        });
                        E.push({
                            from: node,
                            to: n.id,
                            color: typeof n.color === 'object' ? n.color.border : n.color,
                            dashes: true
                        });
                    } else {
                        N.push({
                            id: n.id,
                            label: ` ${n.label} `,
                            color: n.color,
                            font: {
                                color:
                                    codexTheme === 'dark'
                                        ? theme.HealthCareDashboard.White
                                        : theme.HealthCareDashboard.Black,
                                font: { size: 32, face: 'Roboto' }
                            },
                            shape: n.shape,
                            group: n.group
                        });
                        E.push({
                            from: node,
                            to: n.id,
                            color: typeof n.color === 'object' ? n.color.border : n.color,
                            dashes: true
                        });
                    }
                }
            }
            setRender(() => ({ nodes: N, edges: E }));
        }
    };

    const getChildren = (node) => {
        //function for handling second graph
        if (node === initialData.nodes[0].id) {
            setMenu(initialData.nodes[0]);
            setTwo(initialData);
            return;
        }
        const rootNode = apiData.filter((item) => item.parent_id === null);
        const selectedNode = apiData.filter((item) => item.id === node);
        let result = toglingNode(node);
        result.push(rootNode[0], selectedNode[0]);
        let nodes = [];
        let edges = [];
        for (let node of result) {
            let dashes;
            if (node.group === 'industry') {
                dashes = true;
            } else if (node.group === 'root') {
                dashes = false;
            } else if (node.group === 'category') {
                setMenu(node);
                dashes = false;
            } else if (node.group === 'function') {
                dashes = true;
            } else if (node.group === 'subfunction') {
                dashes = true;
            } else if (node.group === 'application') {
                dashes = true;
            }
            if (node.group === 'function' || node.group === 'subfunction') {
                nodes.push({
                    id: node.id,
                    label: node.label,
                    group: node.group,
                    shape: node.shape,
                    color: node.color,
                    font: {
                        color:
                            codexTheme === 'dark'
                                ? theme.HealthCareDashboard.White
                                : theme.HealthCareDashboard.Black,
                        size: 18,
                        align: 'center',
                        bold: true,
                        face: 'Roboto'
                    },
                    title: node.title
                });
            } else if (node.group === 'application') {
                nodes.push({
                    id: node.id,
                    label: node.label,
                    group: node.group,
                    shape: node.shape,
                    font: {
                        color:
                            codexTheme === 'dark'
                                ? theme.HealthCareDashboard.White
                                : theme.HealthCareDashboard.Black,
                        size: 18,
                        align: 'center',
                        bold: true,
                        face: 'Roboto'
                    },
                    title: node.title
                });
            } else {
                nodes.push({
                    id: node.id,
                    label: node.label,
                    group: node.group,
                    color: node.color,
                    shape: node.shape,
                    title: node.title
                });
            }

            if (node.id !== 1) {
                let toId = result.filter((item) => item.id === node.parent_id);
                edges.push({
                    from: toId[0].id,
                    to: node.id,
                    color: typeof node.color === 'object' ? node.color.border : node.color,
                    dashes: dashes
                });
            }
        }
        setTwo({ nodes: nodes, edges: edges });
    };
    const handleMenu = (node) => {
        //function for handling left side menu
        showChildrens(node.id);
        getChildren(node.id);
    };
    const events = {
        //events for handling first graph
        click: function (event) {
            let { nodes } = event;
            if (nodes[0]) {
                showChildrens(nodes[0]);
            } else {
                return;
            }
        }
    };
    const events2 = {
        //events for handling second graph
        click: function (event) {
            let { nodes } = event;
            const rootNode = apiData.filter((item) => item.parent_id === null);
            const dataFilter = apiData.filter((item) => item.parent_id === rootNode[0].id);
            const ids = [];
            let application = apiData.filter((el) => el.id === nodes[0])[0];
            if (application && application.group === 'application') {
                //redirecting  to the application tab
                window.open(`${window.location.origin}/app/${application.actual_id}`);
                return;
            }
            for (let x of dataFilter) {
                ids.push(x.id);
            }
            if (ids.includes(nodes[0]) || nodes[0] === rootNode[0].id) {
                getChildren(nodes[0]);
            } else {
                return;
            }
        }
    };
    useEffect(() => {
        //mounting phase
        getData();
        bodyRef.current.click();
    }, []);

    useEffect(() => {
        genrateJson();
        if (apiData && apiData.length > 0) {
            const logo = FetchLogoname(dashboardId);
            fetchlogoRef.current = logo;
        }
    }, [apiData, dashboardId]);

    return (
        <div className={classes.healthCareContainer} ref={bodyRef}>
            <LeftMenu setMenu={setMenu} handleMenu={handleMenu} menu={menu} apiData={apiData} />
            {section === 'heirarcy' ? (
                <div className={classes.container}>
                    <Graph
                        graph={render}
                        options={options}
                        events={events}
                        style={{ width: '85.7vw', minHeight: '80vh' }}
                    />
                </div>
            ) : (
                <div className={classes.container}>
                    {' '}
                    <Graph
                        graph={two}
                        options={options}
                        events={events2}
                        style={{ width: '85.7vw', minHeight: '80vh' }}
                    />
                </div>
            )}
        </div>
    );
}
