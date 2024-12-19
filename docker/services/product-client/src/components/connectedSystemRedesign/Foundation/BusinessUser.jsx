import React, { useEffect, useRef, useState } from 'react';
import BusinessProcess from 'components/connectedSystem/BusinessProcess';
import SideDrawer from 'components/connectedSystem/SideDrawer/SideDrawer';
import { Grid, withStyles, Dialog, IconButton, DialogContent, Typography } from '@material-ui/core';
import KpiCard from 'components/connectedSystem/KpiCard';
import { springConfig } from 'util/spring-config';
import { animated, useSpring, useTrail } from '@react-spring/web';
import Goals from 'components/connectedSystem/Goals';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Close, ChevronLeft } from '@material-ui/icons';
import {
    getInitiativesAndGoals,
    getProblemAreas,
    getProblemOverview
} from 'services/connectedSystem';
import connSystemFoundationTabstyle from 'assets/jss/connSystemFoundationTabstyle.jsx';
import HorizontalScroll from 'components/connectedSystem/HorizontalScroll';
import { ReactComponent as ScatterGraphSvg } from 'assets/img/scatterGraph.svg';
import clsx from 'clsx';
import * as _ from 'underscore';

function BusinessUser(props) {
    const business_user_classes = props.classes;
    const { data } = props;
    const classes = data.classList;
    const [goalData, setGoalData] = useState([]);
    const [appData, setAppData] = useState([]);
    const [goal, setGoal] = useState({});
    const [popUpData, setPopUpData] = useState([]);
    const [problemArea, setProblemArea] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [workflows, setWorkflows] = useState([]);
    const [foundationApps] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selected_fn, setSelected_fn] = useState(false);
    const [selected_workflow, setSelectedWorkflow] = useState(false);
    const [childworkflow, setChildworkflow] = useState(false);
    const [openKpiDialogue, setOpenKpiDialogue] = useState(false);
    const [show_drawer, setShow_drawer] = useState(false);
    const [drawerIcon, setDrawerIcon] = useState(false);
    const [selected_database, setSelected_database] = useState(false);
    const [redirectionReference, setRedirectionReference] = useState([]);
    const screenRatio = window.screen.availWidth / document.documentElement.clientWidth;
    const screenWidth = parseFloat(window.screen.availWidth / screenRatio);
    const computedStyle = getComputedStyle(document.documentElement);
    const remToPx = (rem) => parseFloat(computedStyle.fontSize) * rem;
    const codexTheme = localStorage.getItem('codx-products-theme');
    const overallconsumptionEle = useRef(null);
    const piePlotlyText = useRef(null);
    const trails = useTrail(functions.length, {
        from: { x: -100 },
        to: { x: 0 },
        config: springConfig
    });
    const [goalSprings, goalApi] = useSpring(() => ({
        from: { x: -300, opacity: 0 }
    }));
    const [goalDataSprings, goalDataApi] = useSpring(() => ({
        from: { x: 900, opacity: 0 }
    }));

    const [businessWorkflowchildSprings, businessWorkflowchildApi] = useSpring(() => ({
        from: { x: -100 }
    }));
    const [businessWorkflowSprings, businessWorkflowApi] = useSpring(() => ({
        from: { x: -100 }
    }));
    const [databaseSprings, databasespringApi] = useSpring(() => ({
        from: { x: -100 }
    }));

    const [qualitySprings, qualityspringsApi] = useSpring(() => ({
        from: { x: 900, opacity: 0 }
    }));

    const fetchGoalsAndInitiatives = async () => {
        getInitiativesAndGoals(data.code, 2).then((response) => {
            setGoal(response.goals);
            setGoalData(response.initiatives);
        });
    };

    const fetchAppData = async () => {
        getProblemOverview(data.code, 2).then((response) => {
            setAppData(response.analysisData);
            setPopUpData(response.kpiPopupData);
        });
    };

    const fetchProblemAreas = async () => {
        getProblemAreas(data.code, 2).then((response) => {
            setProblemArea(response);
        });
    };

    useEffect(() => {
        fetchGoalsAndInitiatives();
        fetchAppData();
        fetchProblemAreas();
        startNodeAnimation(goalApi, { x: [-300, 0], opacity: [0, 1] });
        startNodeAnimation(goalDataApi, { x: [900, 0], opacity: [0, 1] });
    }, []);

    useEffect(() => {
        createFunctionNodes();
        createWorkflowNodes();
    }, [problemArea, selected_database, codexTheme]);

    useEffect(() => {
        createEdges();
    }, [workflows]);

    const startNodeAnimation = (api, animationObj = {}, customSpringConfig = {}) => {
        api.start({
            from: {
                ...(animationObj.x && { x: animationObj.x[0] }),
                ...(animationObj.opacity && { opacity: animationObj.opacity[0] })
            },
            to: {
                ...(animationObj.x && { x: animationObj.x[1] }),
                ...(animationObj.opacity && { opacity: animationObj.opacity[1] })
            },
            config: {
                ...springConfig,
                ...customSpringConfig
            }
        });
    };

    const renderFunctionLabel = (content) => {
        return <div className={'functionLabel'}>{content}</div>;
    };

    const renderWorkflowLabel = (content) => {
        return (
            <animated.div className={'workflowLabel'} style={{ ...businessWorkflowSprings }}>
                {content}
            </animated.div>
        );
    };

    const renderWorkflowchildLabel = (content) => {
        return (
            <animated.div
                className={'workflowchildLabel'}
                style={{ ...businessWorkflowchildSprings }}
            >
                {content}
            </animated.div>
        );
    };

    const renderfoundationApplication = (databases) => {
        const selectDatabase = (id) => {
            if (id === 1) {
                setSelected_database(id);
            } else {
                return;
            }
        };
        return (
            <div className={business_user_classes.business_foundationApp}>
                {databases.map((database) => (
                    <animated.div
                        style={{
                            ...databaseSprings
                        }}
                        className={
                            selected_database
                                ? database.id === selected_database
                                    ? 'foundationAppLabel'
                                    : 'foundationAppLabelSelected'
                                : 'foundationAppLabel'
                        }
                        key={database.id}
                        onClick={() => {
                            selectDatabase(database.id);
                        }}
                    >
                        {database.name}
                    </animated.div>
                ))}
            </div>
        );
    };
    const createFunctionNodes = () => {
        const problems = problemArea.map((node_item) => {
            return {
                id: 'fn_node_' + node_item.id,
                data: { label: renderFunctionLabel(node_item.name) },
                node_type: 'function',
                style: {
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    width: 'fit-content'
                }
            };
        });
        setFunctions(problems);
    };
    const createWorkflowNodes = () => {
        let childWorkflows = [];
        let databases = [];
        const workflows = problemArea.map((area_node) => {
            let nodes = [];
            if (area_node?.problemDefinition) {
                nodes = area_node.problemDefinition.map((definition_node) => {
                    if (definition_node?.problemDefinition) {
                        for (let database of definition_node.problemDefinition) {
                            childWorkflows.push({
                                id: 'wf_node_child' + database.id,
                                parent_fn_id: 'wf_node_' + definition_node.id,
                                problem_definition_id: database.id,
                                node_type: 'workflow_child',
                                data: { label: renderWorkflowchildLabel(database.name) },
                                style: {
                                    background: 'transparent',
                                    border: 'none',
                                    boxShadow: 'none',
                                    width: 'fit-content'
                                }
                            });
                            if (database?.databases) {
                                databases.push({
                                    id: 'wf_node_child_database' + database.id,
                                    parent_fn_id: 'wf_node_child' + database.id,
                                    problem_definition_id: database.id,
                                    node_type: 'workflow_child_database',
                                    sourcePosition: 'right',
                                    targetPosition: 'left',
                                    data: {
                                        label: renderfoundationApplication(database.databases)
                                    },
                                    style: {
                                        background: 'transparent',
                                        border: 'none',
                                        boxShadow: 'none',
                                        width: 'fit-content'
                                    }
                                });
                            }
                        }
                    }
                    return {
                        id: 'wf_node_' + definition_node.id,
                        parent_fn_id: 'fn_node_' + area_node.id,
                        problem_definition_id: definition_node.id,
                        node_type: 'workflow',
                        data: { label: renderWorkflowLabel(definition_node.name) },
                        style: {
                            background: 'transparent',
                            border: 'none',
                            boxShadow: 'none',
                            width: 'fit-content'
                        }
                    };
                });
            }
            return nodes;
        });
        setWorkflows(_.flatten([...childWorkflows, ...workflows, ...databases]));
    };

    let nodes = _.union(functions, workflows, foundationApps);

    if (!selected_fn) {
        nodes = nodes.filter((node_item) => {
            return node_item.node_type === 'function';
        });
        trails.map((trail, i) => {
            nodes[i].data.label = <animated.div style={trail}>{nodes[i].data.label}</animated.div>;
        });
    } else if (!selected_workflow || !childworkflow) {
        nodes = nodes.filter((node_item) => {
            switch (node_item.node_type) {
                case 'function':
                    return node_item;
                case 'workflow':
                    return node_item.parent_fn_id === selected_fn;
                case 'workflow_child':
                    return node_item.parent_fn_id === selected_workflow;
            }
        });
    } else {
        nodes = nodes.filter((node_item) => {
            switch (node_item.node_type) {
                case 'function':
                    return node_item;
                case 'workflow':
                    return node_item.parent_fn_id === selected_fn;
                case 'workflow_child':
                    return node_item.parent_fn_id === selected_workflow;
                case 'workflow_child_database':
                    return node_item.parent_fn_id === childworkflow;
            }
        });
    }

    let fn_index = 0;
    let workflow_index = 1;

    let i = 1;
    let Ygap = 20;
    const nodeX = screenWidth / 3.8 - remToPx(20);
    nodes = nodes.map((node_item) => {
        switch (node_item.node_type) {
            case 'function':
                node_item.id === selected_fn
                    ? (node_item['className'] = classes.fnNodeSelected)
                    : (node_item['className'] = classes.fnNode);
                node_item['position'] = {
                    x: 0,
                    y: Ygap + remToPx(6) * fn_index
                };
                node_item['type'] = 'input';
                node_item['sourcePosition'] = 'right';
                fn_index++;
                break;
            case 'workflow':
                node_item.id === selected_workflow
                    ? (node_item['className'] = `${classes.workflowNodeNotSelectedData}`)
                    : selected_workflow
                    ? (node_item['className'] = classes.workflowNodeNotSelected)
                    : (node_item['className'] = classes.workflowNode);
                node_item['position'] = {
                    x: nodeX + 25,
                    y: workflow_index * 25
                };
                node_item['targetPosition'] = 'left';
                node_item['sourcePosition'] = 'right';
                workflow_index++;
                break;
            case 'workflow_child':
                node_item.id === childworkflow
                    ? (node_item['className'] = `${classes.workflowNodeNotSelectedData}`)
                    : childworkflow
                    ? (node_item['className'] = classes.workflowNodeNotSelected)
                    : (node_item['className'] = classes.workflowNode);
                node_item['position'] = {
                    x: nodeX * 1.7,
                    y: i * 25
                };
                node_item['targetPosition'] = 'left';
                node_item['sourcePosition'] = 'right';
                i++;
                break;
            case 'workflow_child_database':
                node_item['position'] = {
                    x: nodeX * 2.3,
                    y: 30
                };
                node_item['className'] = classes.workFlowDatabase;
                break;
        }
        return node_item;
    });

    const createEdges = () => {
        const wf_edges = workflows.map((workflow, index) => {
            return {
                id: 'wf_edge_' + index,
                source: workflow.parent_fn_id,
                target: workflow.id,
                animated: false,
                hidden: false,
                edgeType: workflow.node_type
            };
        });
        setEdges(wf_edges);
    };

    const newEdges = edges.map((filtered_edge_item) => {
        if (selected_fn && selected_workflow && childworkflow) {
            filtered_edge_item.className = classes.edgeNotSelected;
        } else {
            filtered_edge_item.className = classes.edge;
        }
        if (filtered_edge_item.edgeType === 'workflow_child_database') {
            filtered_edge_item.type = 'straightedge';
            filtered_edge_item.className = classes.databaseEdge;
        } else {
            filtered_edge_item.type = 'smoothstep';
        }

        return filtered_edge_item;
    });

    const onNodeClick = (event, node) => {
        switch (node.node_type) {
            case 'function':
                setSelectedWorkflow(false);
                if (selected_fn === node.id) {
                    setSelected_fn(false);
                    setDrawerIcon(false);
                } else {
                    setSelected_fn(node.id);
                    startNodeAnimation(
                        businessWorkflowApi,
                        { x: [-100, 0] },
                        { velocity: 0, tension: 200 }
                    );
                }
                break;
            case 'workflow':
                if (selected_workflow === node.id) {
                    setSelectedWorkflow(null);
                    setChildworkflow(false);
                    setDrawerIcon(false);
                } else {
                    setDrawerIcon(true);
                    startNodeAnimation(businessWorkflowchildApi, { x: [-100, 0] });
                    setSelectedWorkflow(node.id);
                    setChildworkflow(false);
                }
                break;

            case 'workflow_child':
                if (childworkflow === node.id) {
                    setChildworkflow(false);
                    startNodeAnimation(qualityspringsApi, { x: [0, 900], opacity: [1, 0] });
                    setSelected_database(false);
                } else {
                    startNodeAnimation(databasespringApi, { x: [-100, 0] });
                    startNodeAnimation(qualityspringsApi, { x: [900, 0], opacity: [0, 1] });
                    setChildworkflow(node.id);
                }
                break;
        }
    };
    const KpiDialog = () => {
        setOpenKpiDialogue(true);
    };
    const hideKpiDialogue = () => {
        setOpenKpiDialogue(false);
    };

    const openDrawer = () => {
        setShow_drawer(!show_drawer);
    };

    const toggleStyle = useSpring({
        right: show_drawer ? '50%' : '0.75%',
        rotate: show_drawer ? '180deg' : '0deg',
        transform: show_drawer ? 'translateX(0rem)' : 'translateX(1rem)',
        config: {
            ...springConfig,
            duration: 1500
        }
    });
    const drawerStyle = useSpring({
        transform: show_drawer ? 'translateX(-5%)' : 'translateX(45%)',
        opacity: show_drawer ? 1 : 0,
        config: {
            ...springConfig,
            duration: 1500
        }
    });

    const handleRedirectedDefaultSelectionSubChild = (parentReference, redirectionReference) => {
        //Sub Child level redirection default selection
        if (!redirectionReference?.subChildID) {
            return; // No need to continue if there's no child
        }

        const subChildReference = `wf_node_child${redirectionReference?.subChildID}`;
        const isSubChildExist = workflows.find((element) => element.id === subChildReference);

        if (isSubChildExist && isSubChildExist.parent_fn_id === parentReference) {
            startNodeAnimation(databasespringApi, { x: [-100, 0] });
            startNodeAnimation(qualityspringsApi, { x: [900, 0], opacity: [0, 1] });
            setChildworkflow(subChildReference);
            setRedirectionReference(redirectionReference);
        }
    };

    const handleRedirectedDefaultSelectionChild = (parentReference, redirectionReference) => {
        //Child level redirection default selection
        if (!redirectionReference?.childID) {
            return; // No need to continue if there's no child
        }

        const childReference = `wf_node_${redirectionReference?.childID}`;
        const isChildExist = workflows.find((element) => element.id === childReference);

        if (isChildExist && isChildExist?.parent_fn_id === parentReference) {
            startNodeAnimation(businessWorkflowchildApi, { x: [-100, 0] });
            setSelectedWorkflow(childReference);
            setRedirectionReference(redirectionReference);
            handleRedirectedDefaultSelectionSubChild(parentReference, redirectionReference);
        }
    };

    const handleRedirectedDefaultSelectionParent = (redirectionReference) => {
        //Parent level redirection default selection
        const parentReference = `fn_node_${redirectionReference?.parentID}`;

        const isParentExist = functions.find((element) => element.id === parentReference);

        if (isParentExist) {
            setSelected_fn(parentReference);
            startNodeAnimation(
                businessWorkflowApi,
                { x: [-100, 0] },
                { velocity: 0, tension: 200 }
            );
            setRedirectionReference(redirectionReference);
            handleRedirectedDefaultSelectionChild(parentReference, redirectionReference);
        }
    };

    useEffect(() => {
        // This function will set default selected values for nodes when redirectionReference data is passed in props.
        if (props?.redirectionReference?.toTab !== redirectionReference.toTab && nodes.length > 0) {
            handleRedirectedDefaultSelectionParent(props?.redirectionReference);
        }
    }, [nodes]);

    return (
        <React.Fragment>
            <div className={classes.connSystemGridTop}>
                <animated.div
                    className={business_user_classes.business_connSystemGoals}
                    style={goalSprings}
                >
                    <Goals goals={goal} fit={true} />
                </animated.div>
                <animated.div
                    className={business_user_classes.goalDataContainer}
                    style={goalDataSprings}
                >
                    {goalData ? (
                        <HorizontalScroll>
                            {goalData.map((item, index) => (
                                <KpiCard
                                    item={item}
                                    key={index}
                                    marginLeft={'40%'}
                                    width={'18.60vw'}
                                    minWidth="250px"
                                    background={
                                        codexTheme !== 'dark'
                                            ? 'linear-gradient(131deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)'
                                            : ''
                                    }
                                    title={{
                                        fontStyle: 'Roboto',
                                        fontWeight: 400,
                                        letterSpacing: '1px',
                                        paddingLeft: '1rem'
                                    }}
                                    graphHeight={index === 2 || index === 0 ? '100%' : '100%'}
                                    graphWidth={index === 2 || index === 0 ? '110%' : '100%'}
                                    graphMarginLeft={index === 2 || index === 0 ? '0rem' : '1rem'}
                                    {...(index === 1 ? { graphmarginTop: '0rem' } : {})}
                                />
                            ))}
                        </HorizontalScroll>
                    ) : null}
                </animated.div>
            </div>
            <div
                className={clsx(
                    classes.connSystemGridMiddle,
                    business_user_classes.business_middleGrid
                )}
            >
                <div className={business_user_classes.business_businessProcessHolder}>
                    <BusinessProcess
                        classes={classes}
                        nodes={nodes}
                        edges={newEdges}
                        onNodeClick={onNodeClick}
                    />
                </div>
                {
                    <div className={business_user_classes.business_dataHolder}>
                        <animated.div
                            style={drawerStyle}
                            className={business_user_classes.business_foundationDataSideDrawer}
                        >
                            <SideDrawer
                                selected_workflow={'wf_node_1'}
                                tab={2}
                                dashboardCode={data.code}
                            />
                        </animated.div>
                        {drawerIcon && (
                            <animated.div
                                style={toggleStyle}
                                className={business_user_classes.business_foundationTabLeftIcon}
                            >
                                <ChevronLeft
                                    className={business_user_classes.business_drawerRight}
                                    onClick={openDrawer}
                                />
                            </animated.div>
                        )}
                        {
                            <animated.div
                                className={business_user_classes.business_appDataHolder}
                                style={qualitySprings}
                            >
                                <div className={business_user_classes.business_infoIconHolder}>
                                    <InfoOutlinedIcon
                                        className={business_user_classes.business_infoIcon}
                                        onClick={KpiDialog}
                                    />
                                </div>
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        className={business_user_classes.business_appDataContainer}
                                    >
                                        <div
                                            className={
                                                business_user_classes.business_flexContainers
                                            }
                                        >
                                            <div
                                                className={
                                                    business_user_classes.business_appDataPlotlyHolder
                                                }
                                            >
                                                <ScatterGraphSvg
                                                    className={business_user_classes.svgHolder}
                                                />
                                                <KpiCard
                                                    item={appData[0]}
                                                    bottomPadding={'1rem'}
                                                    border="none"
                                                    background="transparent"
                                                    graphHeight={'100%'}
                                                    graphWidth={'100rem'}
                                                    cardMarginLeft={'0rem'}
                                                    title={{
                                                        fontStyle: 'Roboto',
                                                        fontSize: '1.8rem',
                                                        fontSizeLg: '1.5rem',
                                                        fontSizeXl: '1.75rem',
                                                        fontWeight: 500
                                                    }}
                                                    height={'100%'}
                                                    marginLeft="1rem"
                                                />
                                            </div>
                                            <div
                                                className={
                                                    business_user_classes.business_verticalKpiHolder
                                                }
                                            >
                                                {appData.slice(1, 3).map((val, key) => (
                                                    <KpiCard
                                                        key={`appDataKpi${key}`}
                                                        item={val}
                                                        background={
                                                            codexTheme == 'light'
                                                                ? '#fff'
                                                                : `#07294E30`
                                                        }
                                                        bottomPadding={'0rem'}
                                                        cardPaddingBottom={'0rem'}
                                                        height={'100%'}
                                                        descriptiveHeading={{
                                                            opacity: 0.6,
                                                            paddingBottom: '0rem',
                                                            paddingTop: '1rem',
                                                            fontSize: '1.5rem'
                                                        }}
                                                        descriptiveSubHeading={{
                                                            color: '#220047',
                                                            fontSize: '1rem'
                                                        }}
                                                        border={
                                                            codexTheme === 'dark'
                                                                ? '0.5px solid #07294E'
                                                                : '0.5px solid #22004733'
                                                        }
                                                        layoutWidth={100}
                                                        layoutHeight={100}
                                                        rightWidth={'80px'}
                                                        title={{
                                                            fontStyle: 'Roboto',
                                                            fontSize: '1.5rem',
                                                            fontSizeLg: '1.7rem',
                                                            fontSizeXl: '1.8rem',
                                                            fontWeight: 500
                                                        }}
                                                        rightContainer={{
                                                            paddingLeft: '0rem',
                                                            marginLeft: '5rem'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        className={
                                            business_user_classes.business_appDataContainerBotttom
                                        }
                                    >
                                        <div
                                            className={
                                                business_user_classes.business_flexContainersBottom
                                            }
                                        >
                                            <div
                                                className={
                                                    business_user_classes.business_kpiBoxHolder
                                                }
                                            >
                                                <div
                                                    className={
                                                        business_user_classes.business_dataGraphHolder
                                                    }
                                                >
                                                    <KpiCard
                                                        borderRadius="0rem"
                                                        item={appData[3]}
                                                        background="transparent"
                                                        border="none"
                                                        bottomPadding={'1rem'}
                                                        graphHeight={'65%'}
                                                        graphWidth={'27rem'}
                                                        cardMarginLeft={'0rem'}
                                                        cardPaddingLeft={'0rem'}
                                                        height={'100%'}
                                                        title={{
                                                            fontStyle: 'Roboto',
                                                            fontSize: '1.8rem',
                                                            fontSizeLg: '1.8rem',
                                                            fontSizeXl: '1.9rem',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        business_user_classes.business_bottomKpiHolder
                                                    }
                                                >
                                                    {appData.slice(4, 6).map((val, key) => (
                                                        <KpiCard
                                                            item={val}
                                                            key={`appDataKpi${key}`}
                                                            border="none"
                                                            background="transparent"
                                                            bottomPadding={'0rem'}
                                                            height={'100%'}
                                                            descriptiveHeading={{
                                                                opacity: 0.6,
                                                                paddingBottom: '0rem',
                                                                paddingTop: '1rem',
                                                                fontSize: '1.5rem'
                                                            }}
                                                            descriptiveSubHeading={{
                                                                color: '#220047',
                                                                fontSize: '1rem'
                                                            }}
                                                            marginLeft={0}
                                                            title={{
                                                                fontStyle: 'Roboto',
                                                                fontSize: '1.5rem',
                                                                fontSizeLg: '1.7rem',
                                                                fontSizeXl: '1.8rem',
                                                                fontWeight: 500
                                                            }}
                                                            rightHeading={{
                                                                fontSize: '3rem'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    business_user_classes.business_kpiBoxHolder2
                                                }
                                            >
                                                <div
                                                    className={
                                                        business_user_classes.business_leftContainer
                                                    }
                                                    ref={overallconsumptionEle}
                                                >
                                                    <div
                                                        className={
                                                            business_user_classes.legendElementsContainer
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                business_user_classes.legendtext
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    business_user_classes.legendBox_one
                                                                }
                                                            ></span>
                                                            Utilized
                                                        </div>
                                                        <div
                                                            className={
                                                                business_user_classes.legendtext
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    business_user_classes.legendBox
                                                                }
                                                            ></span>
                                                            Unutilized
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            left:
                                                                (overallconsumptionEle?.current
                                                                    ?.clientWidth -
                                                                    piePlotlyText?.current
                                                                        ?.clientWidth) /
                                                                    2 || '35%',
                                                            top:
                                                                (overallconsumptionEle?.current
                                                                    ?.clientHeight -
                                                                    piePlotlyText?.current
                                                                        ?.clientHeight) /
                                                                    2 || '44%'
                                                        }}
                                                        className={
                                                            business_user_classes.overAllConsumptionData
                                                        }
                                                        ref={piePlotlyText}
                                                    >
                                                        Total data <br /> assets: 686
                                                    </div>
                                                    <KpiCard
                                                        item={appData[6]}
                                                        border="none"
                                                        graphWidth={`100%`}
                                                        graphHeight={`80%`}
                                                        cardMarginLeft={'0rem'}
                                                        title={{
                                                            fontStyle: 'Roboto',
                                                            fontSize: '1.3rem',
                                                            fontSizeLg: '1.2rem',
                                                            fontSizeXl: '1.2rem',
                                                            fontWeight: 500,
                                                            paddingLeft: '1rem'
                                                        }}
                                                        rightContainer={{
                                                            paddingLeft: '0rem'
                                                        }}
                                                        marginLeft={'0rem'}
                                                        graphMarginLeft={'0rem'}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        business_user_classes.business_rightContainer
                                                    }
                                                >
                                                    {appData.slice(7, 9).map((val, key) => (
                                                        <KpiCard
                                                            item={val}
                                                            key={`appDataKpi${key}`}
                                                            border="none"
                                                            background="transparent"
                                                            bottomPadding={'0rem'}
                                                            height={'100%'}
                                                            descriptiveHeading={{
                                                                opacity: 0.6,
                                                                paddingBottom: '0rem',
                                                                paddingTop: '1rem',
                                                                fontSize: '1.5rem'
                                                            }}
                                                            descriptiveSubHeading={{
                                                                color: '#220047',
                                                                fontSize: '1.5rem'
                                                            }}
                                                            marginLeft={0}
                                                            title={{
                                                                fontStyle: 'Roboto',
                                                                fontSize: '1.6rem',
                                                                fontSizeLg: '1.7rem',
                                                                fontSizeXl: '1.8rem',
                                                                fontWeight: 500
                                                            }}
                                                            rightHeading={{
                                                                fontSize: '3rem'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </animated.div>
                        }
                    </div>
                }
            </div>

            {openKpiDialogue && (
                <Dialog
                    open={openKpiDialogue}
                    fullWidth
                    maxWidth="sm"
                    onClose={hideKpiDialogue}
                    PaperProps={{
                        style: {
                            maxWidth: '100rem'
                        }
                    }}
                    aria-describedby="kpi-dialog-content"
                >
                    <DialogContent
                        className={business_user_classes.business_dialogContent}
                        id="kpi-dialog-content"
                    >
                        <div className={business_user_classes.business_box}>
                            <Typography className={business_user_classes.business_popUpHeading}>
                                KPI
                            </Typography>
                            <IconButton
                                onClick={hideKpiDialogue}
                                className={business_user_classes.business_dialogIcon}
                            >
                                <Close fontSize="large" />
                            </IconButton>
                        </div>
                        <div className={business_user_classes.business_kpiDiv}>
                            <Grid container spacing={4}>
                                {popUpData.map((item, index) => (
                                    <Grid
                                        item
                                        key={index}
                                        xs={4}
                                        className={business_user_classes.business_kpiHolder}
                                    >
                                        <KpiCard
                                            border={
                                                codexTheme == 'dark'
                                                    ? '1px solid #3468CA90'
                                                    : '1px solid #3468CA90'
                                            }
                                            item={item}
                                            width={'27rem'}
                                            height={'12rem'}
                                            background={
                                                codexTheme == 'dark' ? '#091F3A' : '#FFFFFF70'
                                            }
                                            title={{
                                                fontWeight: '0',
                                                color: codexTheme == 'dark' ? '#FFFFFF' : '#091F3A',
                                                paddingLeft: '1rem',
                                                width: 'fit-content'
                                            }}
                                            descriptiveHeading={{
                                                color: codexTheme == 'dark' ? '#FFFFFF' : '#091F3A',
                                                paddingLeft: '1rem',
                                                paddingTop: '1rem'
                                            }}
                                            typeTwoText={{
                                                color: codexTheme == 'dark' ? '#FFFFFF' : '#091F3A',
                                                paddingLeft: '1rem'
                                            }}
                                            typeOneText={{
                                                color: codexTheme == 'dark' ? '#FFFFFF' : '#091F3A',
                                                paddingLeft: '1rem'
                                            }}
                                            rightContainer={{
                                                paddingLeft: '0rem'
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </React.Fragment>
    );
}

export default withStyles(connSystemFoundationTabstyle, { withTheme: true })(BusinessUser);
