import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { animated, useSpring, useTrail } from '@react-spring/web';
import { springConfig } from 'util/spring-config';
import { Grid } from '@material-ui/core';
import {
    getInitiativesAndGoals,
    getProblemAreas,
    getProblemOverview,
    getInsights,
    getSolutions
} from 'services/connectedSystem';
import Solutions from 'components/connectedSystem/Solutions';
import BusinessProcess from 'components/connectedSystem/BusinessProcess';
import KpiCard from 'components/connectedSystem/KpiCard';
import Goals from 'components/connectedSystem/Goals';
import ModelsTable from './ModelsTable';
import { ChevronLeft } from '@material-ui/icons';
import { ReactComponent as ScatterGraphSvg } from 'assets/img/scatterGraph.svg';
import { ReactComponent as ScatterLineGraphSvg } from 'assets/img/scatterLineGraph.svg';
import clsx from 'clsx';
import connectedSystemIntelligenceTabStyle from 'assets/jss/connectedSystemIntelligenceTabStyle.jsx';
import MinervaChatbot from 'components/minerva/MinervaChatbot';

const useStyles = makeStyles((theme) => ({
    ...connectedSystemIntelligenceTabStyle(theme)
}));

export default function IntelligenceDataTab({ classes, dashboardCode, ...props }) {
    const currentClasses = useStyles();
    const [problemArea, setProblemArea] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [workflows, setWorkflows] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selected_fn, setSelected_fn] = useState(false);
    const [selected_workflow, setSelectedWorkflow] = useState(false);
    const [childworkflow] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [appData, setAppData] = useState({});
    const [midAppData, setMidAppData] = useState({});
    const [modelsViewData, setModelsViewData] = useState({ columns: [], data: [] });
    const [modelsMetadata, setModelsMetadata] = useState({ columns: [], data: [] });
    const [kpiPopupData, setKpiPopupData] = useState([]);
    const [insightsData, setInsightsData] = useState([]);
    const [tools, setTools] = useState([]);
    const [sideData, setSidedata] = useState([]);
    const [GoalData, setGoalData] = useState([]);
    const [redirectionReference, setRedirectionReference] = useState([]);
    const theme = localStorage.getItem('codx-products-theme');
    const trails = useTrail(functions.length, {
        from: { x: -100 },
        to: { x: 0 },
        config: springConfig
    });
    const [businessWorkflowchildSprings, businessWorkflowchildApi] = useSpring(() => ({
        from: { x: -100 }
    }));
    const [businessWorkflowSprings, businessWorkflowApi] = useSpring(() => ({
        from: { x: -100 }
    }));

    const remToPx = (rem) => parseFloat(getComputedStyle(document.documentElement).fontSize) * rem;

    const fetchProblemAreas = async () => {
        getProblemAreas(dashboardCode, 1).then((response) => {
            setProblemArea(response);
        });
    };

    const fetchInsightsData = async () => {
        getInsights(dashboardCode, 1).then((response) => {
            setInsightsData(response);
        });
    };

    const fetchTools = async () => {
        getSolutions(dashboardCode, 1).then((response) => {
            setTools(response);
        });
    };

    useEffect(() => {
        fetchProblemAreas();
        fetchInsightsData();
        fetchTools();
    }, []);

    useEffect(() => {
        createFunctionNodes();
        createWorkflowNodes();
    }, [problemArea]);

    useEffect(() => {
        createEdges();
    }, [workflows]);

    const [goalSprings, goalApi] = useSpring(() => ({
        from: { x: -300, opacity: 0 }
    }));
    const [goalDataSprings, goalDataApi] = useSpring(() => ({
        from: { x: 900, opacity: 0 }
    }));
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
                className={`foundationAppLabel ${currentClasses.worflowChild}`}
                style={{
                    ...businessWorkflowchildSprings,
                    width: '180px',
                    height: '50px',
                    paddingLeft: '0rem',
                    paddingRight: '0rem'
                }}
            >
                {content}
            </animated.div>
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

    // TODO: Optimize this code in the next release
    const createWorkflowNodes = () => {
        let childWorkflows = [];
        const workflows = problemArea.map((area_node) => {
            let wf_nodes = [];
            if (area_node?.problemDefinition) {
                wf_nodes = area_node.problemDefinition.map(function (definition_node) {
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
            return wf_nodes;
        });

        setWorkflows([...childWorkflows.flat(), ...workflows.flat()]);
    };

    let nodes = [...functions, ...workflows];

    nodes = nodes.filter((node_item) => {
        switch (node_item.node_type) {
            case 'function':
                return true;
            case 'workflow':
                return node_item.parent_fn_id === selected_fn;
            case 'workflow_child':
                return node_item.parent_fn_id === selected_workflow;
        }
    });

    if (!selected_fn) {
        trails.forEach((trail, i) => {
            nodes[i].data.label = <animated.div style={trail}>{nodes[i].data.label}</animated.div>;
        });
    }

    let fn_index = 0;
    let workflow_index = 1;

    let i = 1;
    let Ygap = 20;
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
                    x: 250,
                    y: workflow_index * 30
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
                    x: 450,
                    y: i * 60
                };
                node_item['targetPosition'] = 'left';
                node_item['sourcePosition'] = 'right';
                node_item['className'] = currentClasses.workFlowEdgeStyles;
                i++;
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
        if (filtered_edge_item.id.startsWith('overview_edge_')) {
            filtered_edge_item.className = classes.overviewEdge;
        } else if (
            selected_fn === filtered_edge_item.source &&
            selected_workflow === filtered_edge_item.target
        ) {
            filtered_edge_item.className = classes.edge;
        } else if (selected_fn && selected_workflow && childworkflow) {
            filtered_edge_item.className = classes.edgeNotSelected;
        } else if (filtered_edge_item.edgeType === 'workflow_child') {
            filtered_edge_item.className = currentClasses.lightStyleEdge;
        } else {
            filtered_edge_item.className = classes.edge;
        }
        filtered_edge_item.type = 'smoothstep';
        return filtered_edge_item;
    });

    const onNodeClick = (event, node) => {
        switch (node.node_type) {
            case 'function':
                setSelectedWorkflow(false);
                if (selected_fn === node.id) {
                    setSelected_fn(false);
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
                } else {
                    startNodeAnimation(businessWorkflowchildApi, { x: [-100, 0] });
                    setSelectedWorkflow(node.id);
                }
                break;
        }
    };
    const fetchAppData = async () => {
        getInitiativesAndGoals(dashboardCode, 1).then((response) => {
            setAppData(response.goals);
            setGoalData(response.initiatives);
        });
        getProblemOverview(dashboardCode, 1).then((response) => {
            setMidAppData(response.consumptionData);
            setSidedata(response.analysisData);
            setModelsViewData(response.modelsViewData);
            setModelsMetadata(response.modelsMetadata);
            setKpiPopupData(response.kpiPopupData);
        });
    };

    useEffect(() => {
        fetchAppData();
        startNodeAnimation(goalApi, { x: [-300, 0], opacity: [0, 1] });
        startNodeAnimation(goalDataApi, { x: [900, 0], opacity: [0, 1] });
    }, []);

    const onClickDrawerToggle = () => {
        setShowDrawer(!showDrawer);
    };

    const toggleStyle = useSpring({
        right: showDrawer ? '50.8%' : '0%',
        rotate: showDrawer ? '180deg' : '0deg',
        transform: showDrawer ? 'translateX(-2rem)' : 'translateX(1rem)',
        config: {
            ...springConfig,
            duration: 1500
        }
    });
    const drawerStyle = useSpring({
        transform: showDrawer ? 'translateX(0)' : 'translateX(100%)',
        opacity: showDrawer ? 1 : 0,
        config: {
            ...springConfig,
            duration: 1500
        }
    });

    const handleDefaultNodeSelection = (type, value) => {
        if (type === 'function') {
            setSelected_fn(value);
            if (value) {
                startNodeAnimation(
                    businessWorkflowApi,
                    { x: [-100, 0] },
                    { velocity: 0, tension: 200 }
                );
            }
        } else if (type === 'workflow') {
            setSelectedWorkflow(value);
            if (value) {
                startNodeAnimation(businessWorkflowchildApi, { x: [-100, 0] });
            }
        }
    };

    const handleRedirectedDefaultSelectionSubChild = (parentReference, redirectionReference) => {
        //Sub Child level redirection default selection
        if (!redirectionReference?.subChildID) {
            return; // No need to continue if there's no sub child
        }

        //Sub Child Level
        //workflow_child
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
    const windowWidth = window.innerWidth;
    return (
        <React.Fragment>
            <div className={clsx(classes.connSystemGridTop, currentClasses.topSectionHeight)}>
                <animated.div className={currentClasses.connSystemGoals} style={goalSprings}>
                    <Goals goals={appData} fit={true} />
                </animated.div>
                <div>
                    <ScatterGraphSvg className={currentClasses.svgStyle} />
                    <animated.div className={currentClasses.goalData} style={goalDataSprings}>
                        {GoalData.map((item, index) => (
                            <KpiCard
                                item={item}
                                key={index}
                                minWidth={'250px'}
                                graphHeight={'120%'}
                                graphWidth={'120%'}
                                marginLeft={'0%'}
                                graphMarginLeft={'5rem'}
                                graphmarginTop={'-1.5rem'}
                                rightWidth={'13.5vw'}
                                background={
                                    theme !== 'dark'
                                        ? 'linear-gradient(131deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)'
                                        : ''
                                }
                                title={{
                                    fontStyle: 'Roboto',
                                    fontWeight: 400,
                                    letterSpacing: '1px'
                                }}
                                {...(index === 1 || index === 3
                                    ? {
                                          layoutWidth: windowWidth < 1400 ? 220 : 300,
                                          layoutHeight: 60,
                                          customPlotlyClasses: currentClasses.plotlyStyle
                                      }
                                    : {})}
                                {...(index === 2 ? { graphmarginTop: '0.5rem' } : {})}
                                {...(index === 1 ? { graphMarginLeft: '6rem' } : {})}
                                {...(index === 3 ? { graphMarginLeft: '8rem' } : {})}
                                {...(index === 2 ? { bottomPadding: '2rem' } : {})}
                            />
                        ))}
                    </animated.div>
                </div>
            </div>

            <div className={classes.connSystemGridMiddle}>
                <div className={currentClasses.businessProcessHolder}>
                    <BusinessProcess
                        classes={classes}
                        nodes={nodes}
                        edges={newEdges}
                        onNodeClick={onNodeClick}
                        headerText="MODELS OVERVIEW"
                        handleDefaultNodeSelection={handleDefaultNodeSelection}
                        redirectionReference={props.redirectionReference}
                    />
                </div>
                <div className={currentClasses.dataHolder}>
                    <div className={currentClasses.drawerDiv}>
                        <animated.button
                            style={toggleStyle}
                            className={`${classes.connSystemSideDrawerToggle} ${currentClasses.drawerIconStyle}`}
                            onClick={onClickDrawerToggle}
                        >
                            <ChevronLeft />
                        </animated.button>
                    </div>
                    <Grid container className={currentClasses.midKpiFirstSection}>
                        <div className={currentClasses.flexContainers}>
                            <div className={currentClasses.midSectionGraph}>
                                <ScatterLineGraphSvg className={currentClasses.svgStyle} />
                                <KpiCard
                                    item={midAppData[0]}
                                    bottomPadding={'1rem'}
                                    border="none"
                                    height={'100%'}
                                    graphHeight={'100%'}
                                    cardMarginLeft={'0rem'}
                                    graphWidth={'90rem'}
                                    title={{
                                        fontSize: '1.6rem',
                                        fontStyle: 'Roboto',
                                        fontWeight: 300
                                    }}
                                />
                            </div>
                            <div className={currentClasses.verticalKpiHolder}>
                                <KpiCard
                                    item={midAppData[1]}
                                    background={
                                        theme === 'dark' ? '#07294E' : 'rgba(255, 255, 255, 0.80)'
                                    }
                                    bottomPadding={'0rem'}
                                    height={'50%'}
                                    border={'0.5px solid #220047'}
                                    descriptiveHeading={{
                                        opacity: 0.6,
                                        paddingBottom: '0rem',
                                        paddingTop: '0.2rem',
                                        fontSize: '1.3rem',
                                        fontSizeLg: '1.3rem',
                                        fontSizeXl: '1.3rem'
                                    }}
                                    descriptiveSubHeading={{
                                        fontSize: '1.3rem',
                                        fontSizeLg: '1.3rem',
                                        fontSizeXl: '1.3rem',
                                        color: '#220047'
                                    }}
                                    title={{
                                        fontSize: '1.4rem',
                                        fontStyle: 'Roboto',
                                        fontWeight: 300,
                                        fontSizeLg: '1.3rem',
                                        fontSizeXl: '1.3rem',
                                        marginTop: '0.4rem'
                                    }}
                                    rightHeading={{
                                        fontSize: '2.25rem'
                                    }}
                                />
                                <KpiCard
                                    item={midAppData[2]}
                                    background={
                                        theme === 'dark' ? '#07294E' : 'rgba(255, 255, 255, 0.80)'
                                    }
                                    bottomPadding={'0rem'}
                                    height={'50%'}
                                    border={'0.5px solid #220047'}
                                    descriptiveHeading={{
                                        opacity: 0.6,
                                        paddingBottom: '0rem',
                                        paddingTop: '0.2rem',
                                        fontSize: '1.3rem',
                                        fontSizeLg: '1.3rem',
                                        fontSizeXl: '1.3rem'
                                    }}
                                    descriptiveSubHeading={{
                                        fontSize: '1.3rem',
                                        fontSizeLg: '1.3rem',
                                        fontSizeXl: '1.3rem',
                                        color: '#220047'
                                    }}
                                    title={{
                                        fontSize: '1.4rem',
                                        fontStyle: 'Roboto',
                                        fontWeight: 300,
                                        fontSizeLg: '1.3rem',
                                        fontSizeXl: '1.3rem',
                                        marginTop: '0.4rem'
                                    }}
                                    rightHeading={{
                                        fontSize: '2.25rem'
                                    }}
                                />
                            </div>
                        </div>
                    </Grid>
                    <Grid container className={currentClasses.midKpiCards} spacing={1}>
                        {sideData.map((el, index) => {
                            return (
                                <Grid item xs={6} key={`${el?.lable}-${index}`}>
                                    <KpiCard
                                        item={el}
                                        height={'13.5vh'}
                                        marginLeft={'10%'}
                                        cardMarginLeft={'0rem'}
                                        rightWidth={'350px'}
                                        border={
                                            theme === 'dark'
                                                ? '1px solid #02E0FE66'
                                                : '1px solid #091F3A22'
                                        }
                                        layoutHeight={30}
                                        rightHeight={'70%'}
                                        title={{
                                            fontWeight: 300,
                                            marginTop: '0.5rem'
                                        }}
                                        customPlotlyWrapperClasses={
                                            currentClasses.kpiCardPlotlyWrapperStyle
                                        }
                                        bottomPadding={'0.4rem'}
                                        bottomDetail={true}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                    <animated.div style={drawerStyle} className={currentClasses.modelsWrapper}>
                        <ModelsTable
                            modelsViewData={modelsViewData}
                            modelsMetadata={modelsMetadata}
                            kpiPopupData={kpiPopupData}
                        />
                    </animated.div>
                </div>
            </div>

            <div className={clsx(classes.connSystemGridBottom, currentClasses.bottomSection)}>
                <div className={currentClasses.solutionsFooter}>
                    <Solutions
                        solutions={insightsData}
                        width={'45%'}
                        title={'Insights'}
                        cardCol={3}
                        insightMinWidth={'22rem'}
                        fitContent={true}
                        solutionBorder={
                            theme === 'dark' ? '0.5px solid #02E0FE84' : '0.5px solid #4560D7'
                        }
                    />
                    <Solutions
                        solutions={tools}
                        width={'50.8%'}
                        title={'Tools'}
                        cardCol={3}
                        insightMinWidth={'22rem'}
                        fitContent={true}
                        solutionBorder={
                            theme === 'dark' ? '0.5px solid #FEF40240' : '0.5px solid #F7C43D'
                        }
                    />
                    <div className={currentClasses.connSystem_minervaChatbot}>
                        <MinervaChatbot />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
