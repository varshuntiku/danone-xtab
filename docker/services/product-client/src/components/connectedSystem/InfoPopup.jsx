import React, { useState, useEffect } from 'react';
import { Dialog, IconButton, DialogContent, TableHead, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import { ReactComponent as Tickmark } from './Foundation/icons/TickMark.svg';
import { ReactComponent as TableIcon } from './Foundation/icons/Table.svg';
import { ReactComponent as Sample } from './Foundation/icons/Sample.svg';
import { ReactComponent as Dashboard } from './Foundation/icons/Dashboard.svg';
import { ReactComponent as Order } from './Foundation/icons/Order.svg';
import { ReactComponent as Shipping } from './Foundation/icons/Shipping.svg';
const useStyles = makeStyles((theme) => ({
    flowContainer: {
        marginTop: '4rem'
    },

    dialogTitle: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%'
    },
    dialogIcon: {
        '& svg': {
            color: theme.palette.text.default
        }
    },
    content: {
        marginTop: '3.5rem',
        padding: '2rem',
        backgroundColor: theme.ConnectedSystemDashboard.popUp.nodeBackground,
        borderRadius: '0.8rem',
        boxShadow: theme.ConnectedSystemDashboard.popUp.boxShadow,
        margin: '1rem'
    },
    titleCell: {
        color: theme.ConnectedSystemDashboard.popUp.textColor,
        fontSize: '1.6rem',
        borderBottom: `0.5px solid ${theme.ConnectedSystemDashboard.popUp.nodeBottom}`,
        width: 'fit-content',
        padding: '1.2rem',
        maxWidth: '8rem'
    },
    descriptiveCell: {
        color: `${theme.ConnectedSystemDashboard.popUp.textColor}`,
        fontSize: '1.6rem',
        borderBottom: `0.5px solid ${theme.ConnectedSystemDashboard.popUp.nodeBottom}`,
        padding: '1.2rem'
    },
    tableRow: {
        padding: '1px'
    },
    nodeItem: {
        color: theme.ConnectedSystemDashboard.popUp.textColor,
        fontSize: '1.6rem',
        borderBottom: `0.5px solid ${theme.ConnectedSystemDashboard.popUp.nodeBottom}`,
        padding: '1rem',
        display: 'flex',
        gap: '0.5rem'
    },
    databaseNode: {
        border: `0.5px solid ${theme.ConnectedSystemDashboard.popUp.nodeBorder}`,
        borderRadius: '0.8rem',
        paddingBottom: '0.5rem',
        minWidth: '27rem',
        backgroundColor: theme.ConnectedSystemDashboard.popUp.nodeBackground,
        cusrsor: 'pointer'
    },
    databaseHeading: {
        color: theme.palette.text.titleText,
        borderBottom: `0.5px solid ${theme.ConnectedSystemDashboard.popUp.nodeBottom}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    Head: {
        display: 'flex',
        flexDirection: 'column'
    },
    nodeStyle: {
        '& div.react-flow__handle': {
            visibility: 'hidden'
        },
        '&.react-flow__node-default.selectable:hover': {
            boxShadow: 'none'
        },
        '&.react-flow__node': {
            cursor: 'pointer'
        }
    },
    secondHeading: {
        color: `${theme.palette.text.titleText}`,
        fontSize: '1.6rem'
    },
    firstHeading: {
        color: `${theme.palette.text.titleText}`,
        fontSize: '1.6rem'
    },
    Img: {
        width: '2rem',
        height: '2rem'
    },
    firstSection: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    secondSection: {
        display: 'flex',
        gap: '0.5rem'
    },
    text: {
        fontSize: '1.6rem',
        color: theme.ConnectedSystemDashboard.popUp.textColor
    },
    box: {
        width: '100%',
        backgroundColor: theme.ConnectedSystemDashboard.popUp.headingBackground,
        height: '5rem',
        position: 'absolute',
        top: '0',
        left: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    popUpHeading: {
        color: theme.ConnectedSystemDashboard.popUp.textColor,
        fontSize: '2rem',
        marginLeft: '3%'
    },
    nodeType2: {
        display: 'flex',
        flexDirection: 'column',
        cusrsor: 'pointer'
    },
    base: {
        width: 'fit-content',
        border: `0.5px solid ${theme.ConnectedSystemDashboard.popUp.nodeBorder}`,
        borderRadius: '0.2rem',
        background: theme.ConnectedSystemDashboard.popUp.baseBackground
    },
    nodeType2Heading: {
        border: `0.5px solid ${theme.ConnectedSystemDashboard.popUp.nodeBorder}`,
        borderRadius: '0.5rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        backgroundColor: theme.ConnectedSystemDashboard.popUp.nodeBackground
    },
    nodeType2FirstHeading: {
        color: theme.ConnectedSystemDashboard.popUp.secondHeading,
        fontSize: '1.6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    nodeType2secondHeading: {
        color: theme.ConnectedSystemDashboard.popUp.textColor,
        fontSize: '1.6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    nodeType2Section: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    baseText: {
        color: theme.ConnectedSystemDashboard.popUp.baseColor,
        fontSize: '1.6rem',
        padding: '0.5rem'
    },
    dashboard: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    colorNodeItem: {
        backgroundColor: theme.ConnectedSystemDashboard.popUp.highlightedBackground,
        fontSize: '1.6rem',
        borderBottom: `0.5px solid ${theme.ConnectedSystemDashboard.popUp.nodeBottom}`,
        padding: '1rem',
        display: 'flex',
        gap: '0.5rem'
    },
    colorText: {
        color: theme.ConnectedSystemDashboard.popUp.highlightedText,
        fontSize: '1.6rem'
    },
    dialogContent: {
        padding: '1rem',
        background: theme.ConnectedSystemDashboard.popUp.background
    },
    iconB: {
        width: '2rem',
        height: '2rem',
        stroke: theme.ConnectedSystemDashboard.popUp.iconB
    },
    iconA: {
        width: '2rem',
        height: '2rem',
        stroke: theme.ConnectedSystemDashboard.popUp.iconA,
        strokeWidth: '0.5px'
    },
    iconC: {
        width: '2rem',
        height: '2rem',
        fill: theme.ConnectedSystemDashboard.popUp.iconA,
        strokeWidth: '1.5px'
    },
    iconD: {
        width: '2rem',
        height: '2rem',
        strokeWidth: '0.5px',
        stroke: theme.ConnectedSystemDashboard.popUp.iconB
    }
}));

function InfoPopup(props) {
    const InfoClasses = useStyles();
    const infoData = props.infoData;
    const [flowNodes, setFlowNodes] = useState();
    const screenRatio = window.screen.availWidth / document.documentElement.clientWidth;
    const screenWidth = parseFloat(window.screen.availWidth / screenRatio);
    const computedStyle = getComputedStyle(document.documentElement);
    const remToPx = (rem) => parseFloat(computedStyle.fontSize) * rem;
    const theme = useTheme();
    const renderNode = (type, node) => {
        return (
            <div className={type === 'table' ? InfoClasses.databaseNode : null}>
                {type === 'table' && (
                    <Table>
                        <TableHead className={InfoClasses.Head}>
                            <TableRow className={InfoClasses.tableRow}>
                                <TableCell className={InfoClasses.databaseHeading}>
                                    <div className={InfoClasses.firstSection}>
                                        <Typography className={InfoClasses.firstHeading}>
                                            {node?.tableDetails.heading}
                                        </Typography>
                                        <Tickmark className={InfoClasses.iconB} />
                                    </div>
                                    <div className={InfoClasses.secondSection}>
                                        <TableIcon className={InfoClasses.iconA} />
                                        <Typography className={InfoClasses.secondHeading}>
                                            TABLE.{node?.tableDetails.table}
                                        </Typography>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {node?.details.map((item) => {
                                let Icon;
                                switch (item.icon) {
                                    case 'simple':
                                        Icon = <Sample className={InfoClasses.iconA} />;
                                        break;
                                    case 'order':
                                        Icon = <Order className={InfoClasses.iconC} />;
                                        break;
                                    case 'shipping':
                                        Icon = <Shipping className={InfoClasses.iconD} />;
                                        break;
                                    default:
                                        Icon = <Sample className={InfoClasses.iconA} />;
                                }
                                return (
                                    <TableRow key={item.id} className={InfoClasses.tableRow}>
                                        <TableCell
                                            className={
                                                item.icon === 'shipping'
                                                    ? InfoClasses.colorNodeItem
                                                    : InfoClasses.nodeItem
                                            }
                                        >
                                            {Icon}
                                            <Typography
                                                className={
                                                    item.icon === 'shipping'
                                                        ? InfoClasses.colorText
                                                        : InfoClasses.text
                                                }
                                            >
                                                {item.label}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
                {type === 'dashboard' && (
                    <div className={InfoClasses.nodeType2}>
                        <div className={InfoClasses.base}>
                            <Typography className={InfoClasses.baseText}>BASE</Typography>
                        </div>
                        <div className={InfoClasses.nodeType2Heading}>
                            <div className={InfoClasses.nodeType2Section}>
                                <Typography className={InfoClasses.nodeType2FirstHeading}>
                                    {node?.tableDetails.heading}
                                </Typography>
                                <Tickmark className={InfoClasses.iconB} />
                            </div>
                            <div className={InfoClasses.dashboard}>
                                <Dashboard className={InfoClasses.iconA} />
                                <Typography className={InfoClasses.nodeType2secondHeading}>
                                    DASHBOARD.{node?.tableDetails.table}
                                </Typography>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const edges = [
        { id: 'el-1', type: 'customstep', source: '1', target: '2', markerEnd: 'arrow' },
        { id: 'el-2', type: 'secondedge', source: '1', target: '2', markerEnd: 'arrow' },
        { id: 'el-3', type: 'secondedge', source: '2', target: '3', markerEnd: 'arrow' },
        { id: 'el-4', type: 'customstep', source: '2', target: '3', markerEnd: 'arrow' }
    ];
    const edgeTypes = {
        customstep: Customstepedge,
        secondedge: SecondCustomstepedge
    };
    function Customstepedge({ id, sourceX, sourceY, targetX, targetY }) {
        const stepFactor = 0.5;
        const stepX = sourceX + (targetX - sourceX) * stepFactor;
        let edgePath = `M ${sourceX - 15},${sourceY + 30} H ${stepX} V ${targetY + 30} H ${
            targetX + 14
        }`;
        return (
            <>
                <path
                    id={id}
                    d={edgePath}
                    style={{
                        stroke: theme.ConnectedSystemDashboard.reactflow.edgeOne,
                        strokeWidth: 1,
                        fill: 'none'
                    }}
                />
                <text
                    x={targetX + 17}
                    y={Math.floor(targetY + 36)}
                    fill={theme.ConnectedSystemDashboard.reactflow.edgeOne}
                    fontSize="18"
                    textAnchor="end"
                >
                    &gt;
                </text>
            </>
        );
    }
    function SecondCustomstepedge({ id, sourceX, sourceY, targetX, targetY }) {
        const stepFactor = 0.5;
        const stepX = sourceX + (targetX - sourceX) * stepFactor;
        let edgeLevel = Math.round(remToPx(20)) / 2;
        let edgePath;
        if (id === 'el-3') {
            edgePath = `M ${sourceX - 15},${sourceY - 60} H ${stepX} V ${targetY + 30} H ${
                targetX + 14
            }`;
        } else {
            edgePath = `M ${sourceX - 15},${sourceY - edgeLevel} H ${stepX} V ${
                targetY - edgeLevel
            } H ${targetX + 14}`;
        }

        return (
            <>
                <path
                    id={id}
                    d={edgePath}
                    style={{
                        stroke: theme.ConnectedSystemDashboard.reactflow.edgeTwo,
                        strokeWidth: 1,
                        fill: 'none'
                    }}
                />
                {id !== 'el-3' && (
                    <text
                        x={targetX + 17}
                        y={Math.round(targetY - (edgeLevel - 5))}
                        fill={theme.ConnectedSystemDashboard.reactflow.edgeTwo}
                        fontSize="18"
                        textAnchor="end"
                    >
                        &gt;
                    </text>
                )}
            </>
        );
    }

    let width;
    if (props?.infoData?.type === 'flow') {
        width = '110rem';
    } else {
        width = '85rem';
    }
    const nodeStyle = {
        backgroundColor: 'transparent',
        border: 'none',
        width: 'fit-content'
    };
    const createNodes = () => {
        let x = 10;
        let y = 20;
        const nodeX = screenWidth / 6;
        let xGap = Math.round(nodeX);
        let yGap = 60;
        let h = 0;
        let v = 0;
        let nodes = [];
        for (let node of infoData.data.data) {
            nodes.push({
                id: String(node.id),
                data: { label: renderNode(node.type, node) },
                style: nodeStyle,
                className: InfoClasses.nodeStyle,
                targetPosition: 'left',
                sourcePosition: 'right',
                position: { x: x + xGap * h, y: node.id === 3 ? 10 : y + yGap * v }
            });
            h++;
            v++;
        }
        setFlowNodes(nodes);
    };
    useEffect(() => {
        if (infoData?.type === 'flow') {
            createNodes();
        }
    }, [infoData?.type === 'flow']);

    const nodeStyles = {
        base: {
            ':hover': {
                boxShadow: 'none',
                backgroundColor: 'inherit'
            }
        }
    };
    return (
        <div>
            {
                <Dialog
                    open={props.openDialog}
                    fullWidth
                    maxWidth="sm"
                    onClose={props.onClose}
                    PaperProps={{
                        style: {
                            maxWidth: width
                        }
                    }}
                    className={InfoClasses.dialog}
                    aria-describedby="dialog-content"
                >
                    <DialogContent className={InfoClasses.dialogContent} id="dialog-content">
                        <div className={InfoClasses.box}>
                            <Typography className={InfoClasses.popUpHeading}>
                                {infoData.data.label}
                            </Typography>
                            <IconButton onClick={props.onClose} className={InfoClasses.dialogIcon}>
                                <Close fontSize="large" />
                            </IconButton>
                        </div>
                        <div className={infoData?.type === 'table' ? InfoClasses.content : null}>
                            {infoData.type === 'table' && (
                                <Table>
                                    <TableBody>
                                        {infoData?.data?.data.map((item, index) => (
                                            <TableRow
                                                className={InfoClasses.tableRow}
                                                key={`rowcontent-${index}`}
                                            >
                                                <TableCell className={InfoClasses.titleCell}>
                                                    {item.title}
                                                </TableCell>
                                                <TableCell className={InfoClasses.descriptiveCell}>
                                                    {item.descriptive}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            {infoData.type === 'flow' && (
                                <div className={InfoClasses.flowContainer}>
                                    <ReactFlow
                                        nodeTypes={{
                                            custom: nodeStyles
                                        }}
                                        nodes={flowNodes}
                                        edges={edges}
                                        edgeTypes={edgeTypes}
                                        proOptions={{ hideAttribution: true, account: 'paid-pro' }}
                                        style={{ height: '50vh' }}
                                    />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            }
        </div>
    );
}

export default InfoPopup;
