import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { animated, useSpring, useTrail } from '@react-spring/web';

import { withStyles } from '@material-ui/core/styles';
import { ChevronLeft } from '@material-ui/icons';

import { withRouter } from 'react-router-dom';

import NavBar from 'components/NavBar.jsx';
import Footer from 'components/Footer.jsx';

import connSystemDashboardStyle from 'assets/jss/connSystemDashboardStyle.jsx';

import Goals from 'components/connectedSystem/Goals';
import Initiatives from 'components/connectedSystem/Initiatives';
import DecisionFlow from 'components/connectedSystem/DecisionFlow';
import BusinessProcess from 'components/connectedSystem/BusinessProcess';
import SideDrawer from 'components/connectedSystem/SideDrawer/SideDrawer';
import Stakeholders from 'components/connectedSystem/Stakeholders';
import ImpactCard from 'components/connectedSystem/ImpactCard';
import FoundationDataTab from 'components/connectedSystem/Foundation/FoundationDataTab';
import {
    getInitiativesAndGoals,
    getProblemOverview,
    getProblemAreas,
    getSolutions,
    getStakeholders
} from 'services/connectedSystem';
import IntelligenceDataTab from 'components/connectedSystem/Intelligence/IntelligenceDataTab';

import { springConfig } from 'util/spring-config';

import Solutions from './connectedSystem/Solutions';
import BusinessLatest from 'components/connectedSystem/BusinessProcess/BusinessLatest';

import * as _ from 'underscore';

const screenRatio = window.screen.availWidth / document.documentElement.clientWidth;
const screenWidth = parseFloat(window.screen.availWidth / screenRatio);
const screenHeight = parseFloat(window.screen.availHeight / screenRatio);
const computedStyle = getComputedStyle(document.documentElement);
const remToPx = (rem) => parseFloat(computedStyle.fontSize) * rem;
const fontFamily = computedStyle.fontFamily;
const oldDashboard = false;

const initialRedirectionReference = {
    toTab: '',
    fromTab: '',
    parentID: null,
    parentTitle: null,
    childID: null,
    childTitle: null,
    subChildID: null,
    subChildTitle: null
};

const ConnectedSystemDashboard = (props) => {
    const [businessWorkflowSprings, businessWorkflowApi] = useSpring(() => ({
        from: { x: -100 }
    }));
    const [midYearInfoSprings, midYearInfoApi] = useSpring(() => ({
        from: { x: -100 }
    }));
    const [stakeholdersSprings, stakeholdersApi] = useSpring(() => ({
        from: { x: 0 }
    }));
    const [midYearStakeholdersSprings, midYearStakeholdersApi] = useSpring(() => ({
        from: { x: 0 }
    }));
    const [decisionFlowSprings, decisionFlowApi] = useSpring(() => ({
        from: { x: 0 }
    }));
    const [goalSprings, goalApi] = useSpring(() => ({
        from: { x: -300, opacity: 0 }
    }));
    const [driverSprings, driverApi] = useSpring(() => ({
        from: { x: 300, opacity: 0 }
    }));

    // Props is renamed to newProps with destrcturing classes and dashboardCode
    const { classes, dashboardCode, ...newProps } = props;

    const [selectedTab, setSelectedTab] = useState(0);
    const [selected_fn, setSelectedFunction] = useState(false);
    const [selected_workflow, setSelectedWorkflow] = useState(false);
    const [activeMetrics, setActiveMetrics] = useState([]);
    const [activeSolutions, setActiveSolutions] = useState([]);
    const [stakeholders, setStakeholders] = useState([]);
    const [workflowStakeholders, setWorkflowStakeholders] = useState([]);
    const [stakeholdersView, setStakeholdersView] = useState('landscape');
    const [solutions, setSolutions] = useState([]);
    const [initiatives, setInitiatives] = useState([]);
    const [initiativesData, setInitiativesData] = useState([]);
    const [problemArea, setProblemArea] = useState([]);
    const [problemOverview, setProblemOverview] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [workflows, setWorkflows] = useState([]);
    const [overviews, setOverviews] = useState([]);
    const [edges, setEdges] = useState([]);
    const [show_drawer, setShowDrawer] = useState(false);
    const [goals, setGoals] = useState({});
    const [redirectionReference, setRedirectionReference] = useState(initialRedirectionReference);

    const trails = useTrail(functions.length, {
        from: { x: -100 },
        to: { x: 0 },
        config: springConfig
    });

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

    const renderWorkflowInfoLabel = (_stakeholders, workflowMetrics) => {
        return (
            <div style={{ width: '34rem' }}>
                <animated.div style={midYearStakeholdersSprings}>
                    <Stakeholders stakeholders={_stakeholders} mode={'portrait'} gridCols={1} />
                </animated.div>
                <animated.div style={midYearInfoSprings}>
                    <ImpactCard metrics={workflowMetrics} />
                </animated.div>
            </div>
        );
    };

    useEffect(() => {
        fetchInitiativesAndGoals();
        fetchProblemAreas();
        fetchProblemOverview();
        fetchSolutions();
        fetchStakeholders();
        startNodeAnimation(goalApi, { x: [-300, 0], opacity: [0, 1] });
        startNodeAnimation(driverApi, { x: [300, 0], opacity: [0, 1] });
        // document.getElementById('zenToggle').style.display = 'none';

        const ingestCSViewedEvent = async () => {
            await ingestCustomEventTelemetry();
        };

        ingestCSViewedEvent();
    }, []);

    useEffect(() => {
        createFunctionNodes();
        createWorkflowNodes();
        createInitiativeNodes();
    }, [problemArea, problemOverview, initiativesData]);

    useEffect(() => {
        createEdges();
        createOverviewNodes();
    }, [workflows, activeMetrics]);

    const ingestCustomEventTelemetry = async () => {
        if (
            import.meta.env['REACT_APP_ENABLE_APP_INSIGHTS'] &&
            import.meta.env['REACT_APP_APPLICATIONINSIGHTS_CONNECTION_STRING']
        ) {
            const { appInsights } = await import('util/appInsightsLogger');
            appInsights.trackEvent({
                name: 'Connected System Dashboard Viewed',
                properties: {
                    user_email: sessionStorage.getItem('user_email'),
                    user_name: sessionStorage.getItem('user_name'),
                    environment: import.meta.env['REACT_APP_ENV']
                }
            });
        }
    };

    const fetchInitiativesAndGoals = async () => {
        getInitiativesAndGoals(dashboardCode).then((response) => {
            setInitiativesData(response.initiatives);
            setGoals(response.goals);
        });
    };

    const fetchProblemAreas = async () => {
        getProblemAreas(dashboardCode).then((response) => {
            setProblemArea(response);
        });
    };
    const fetchProblemOverview = async () => {
        getProblemOverview(dashboardCode).then((response) => {
            setProblemOverview(response);
        });
    };

    const fetchSolutions = async () => {
        getSolutions(dashboardCode).then((response) => {
            setSolutions(response);
        });
    };

    const fetchStakeholders = async () => {
        getStakeholders(dashboardCode).then((response) => {
            setStakeholders(response);
        });
    };

    const createFunctionNodes = () => {
        const problems = _.map(problemArea, function (node_item) {
            return {
                id: 'fn_node_' + node_item.id,
                ref_id: node_item.ref_id,
                name: node_item.name,
                data: { label: renderFunctionLabel(node_item.name) },
                node_type: 'function',
                style: {
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none'
                }
            };
        });
        setFunctions(problems);
    };

    const createInitiativeNodes = () => {
        const initiatives = _.map(initiativesData, function (node_item) {
            return {
                id: 'init_node_' + node_item.id,
                name: node_item.name,
                tags: node_item.tags,
                node_type: 'initiatives',
                is_active: node_item.is_active,
                functions: ['fn_node_' + node_item.business_process_id],
                workflows: ['wf_node_' + node_item.problem_definition_id]
            };
        });

        setInitiatives(initiatives);
    };

    const createWorkflowNodes = () => {
        const workflows = _.map(problemArea, function (area_node) {
            return _.map(area_node.problemDefinition, function (definition_node) {
                return {
                    id: 'wf_node_' + definition_node.id,
                    ref_id: definition_node.ref_id,
                    parent_fn_id: 'fn_node_' + area_node.id,
                    problem_definition_id: definition_node.id,
                    node_type: 'workflow',
                    name: definition_node.name,
                    data: { label: renderWorkflowLabel(definition_node.name) },
                    style: {
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none'
                    }
                };
            });
        });

        setWorkflows(_.flatten(workflows));
    };

    const createOverviewNodes = () => {
        const x = screenWidth / 2 - remToPx(40);
        const overviews = _.map(problemOverview, function (overview, index) {
            return {
                id: 'overview_node_' + overview.id + index,
                type: 'output',
                targetPosition: 'left',
                position: { x, y: 0 },
                parent_wf_id: 'wf_node_' + overview.problem_definition_id,
                node_type: 'overview',
                data: {
                    label: renderWorkflowInfoLabel(
                        workflowStakeholders.length ? workflowStakeholders : stakeholders, // TODO: Change ternay operation to just workflowStakeholders once data is fully available
                        activeMetrics
                    )
                },
                style: {
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    paddingLeft: '0.8rem',
                    cursor: 'default'
                }
            };
        });
        setOverviews(overviews);
    };

    const createEdges = () => {
        const wf_edges = _.map(workflows, function (workflow, index) {
            return {
                id: 'wf_edge_' + index,
                source: workflow.parent_fn_id,
                target: workflow.id,
                animated: false,
                hidden: false
            };
        });
        const overview_edges = _.map(overviews, function (overview, index) {
            return {
                id: 'overview_edge_' + index,
                source: overview.parent_wf_id,
                target: overview.id,
                animated: false,
                hidden: false
            };
        });

        let edges = _.union(wf_edges, overview_edges);
        setEdges(edges);
    };

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

    let nodes = _.union(functions, workflows, overviews);
    // let captured_impact = 0;
    // let realized_impact = 0;
    // let completion = 0;
    // let completion_count = 0;

    _.each(nodes, function (node_item) {
        var count_node = false;
        if (node_item.node_type === 'workflow') {
            if (
                selected_workflow &&
                node_item.parent_fn_id === selected_fn &&
                node_item.id === selected_workflow
            ) {
                count_node = true;
            } else if (
                !selected_workflow &&
                selected_fn &&
                node_item.parent_fn_id === selected_fn
            ) {
                count_node = true;
            } else if (!selected_workflow && !selected_fn) {
                count_node = true;
            }
        }

        if (count_node) {
            // completion_count++;
            // completion += parseInt(node_item.status);
            // captured_impact += parseInt(node_item.impact);
            // realized_impact += (node_item.impact * node_item.status) / 100;
        }
    });

    if (!selected_fn) {
        nodes = _.filter(nodes, function (node_item) {
            return node_item.node_type === 'function';
        });
        trails.map((trail, i) => {
            nodes[i].data.label = (
                <animated.div style={trail} key={`&{nodes[i].data.label}`}>
                    {nodes[i].data.label}
                </animated.div>
            );
        });
    } else if (!selected_workflow) {
        nodes = _.filter(nodes, function (node_item) {
            if (node_item.node_type === 'function') {
                return node_item;
            } else if (node_item.node_type === 'workflow') {
                return node_item.parent_fn_id === selected_fn;
            }
        });
    } else {
        nodes = _.filter(nodes, function (node_item) {
            if (node_item.node_type === 'function') {
                return node_item;
            } else if (node_item.node_type === 'workflow') {
                return node_item.parent_fn_id === selected_fn;
            } else if (node_item.node_type === 'overview') {
                return node_item.parent_wf_id === selected_workflow;
            }
        });
    }

    let fn_index = 0;
    let workflow_index = 0;

    const nodeX = screenWidth / 3.8 - remToPx(20);
    const offScreenCanvas = new OffscreenCanvas(1, 1);
    const context = offScreenCanvas.getContext('2d');
    context.font = `400 ${remToPx(2)}px ${fontFamily}`;
    let offsetFn = 0;
    let offsetWf = 0;
    nodes = _.map(nodes, function (node_item) {
        if (node_item.node_type === 'function') {
            const fnTextWidth = context.measureText(node_item.name).width;
            const fnLineCount = Math.ceil(fnTextWidth / remToPx(20)) - 1;
            if (node_item.id === selected_fn) {
                node_item['className'] = classes.fnNodeSelected;
            } else {
                node_item['className'] = classes.fnNode;
            }

            node_item['position'] = {
                x: 0,
                y: 20 + offsetFn + remToPx(6) * fn_index
            };

            node_item['type'] = 'input';
            node_item['sourcePosition'] = 'right';

            offsetFn += fnLineCount * remToPx(2);
            fn_index++;
        } else if (node_item.node_type === 'workflow') {
            const wfTextWidth = context.measureText(node_item.name).width;
            const wfLineCount = Math.ceil(wfTextWidth / remToPx(17)) - 1;
            if (node_item.id === selected_workflow) {
                node_item['className'] = `${classes.workflowNodeSelected}  ${
                    !activeMetrics.length && classes.workflowNoMetricsNodeSelected
                }`;
            } else if (selected_workflow) {
                node_item['className'] = classes.workflowNodeNotSelected;
            } else {
                node_item['className'] = classes.workflowNode;
            }

            node_item['position'] = {
                x: nodeX,
                y: screenHeight / 12 + offsetWf + workflow_index * remToPx(6)
            };
            node_item['targetPosition'] = 'left';
            node_item['sourcePosition'] = 'right';

            offsetWf += wfLineCount * remToPx(2);
            workflow_index++;
        } else if (node_item.node_type === 'overview') {
            node_item['className'] = classes.overviewNode;
        }

        return node_item;
    });

    const newEdges = _.map(edges, function (filtered_edge_item) {
        if (filtered_edge_item.id.startsWith('overview_edge_')) {
            filtered_edge_item.className = classes.overviewEdge;
        } else if (
            selected_fn === filtered_edge_item.source &&
            selected_workflow === filtered_edge_item.target
        ) {
            filtered_edge_item.className = classes.edge;
        } else if (selected_fn && selected_workflow) {
            filtered_edge_item.className = classes.edgeNotSelected;
        } else {
            filtered_edge_item.className = classes.edge;
        }

        filtered_edge_item.type = 'smoothstep';
        // Edit the offset for edges if edges are not appearing properly and are intersecting with each other. Try different values to see what works in you case.
        filtered_edge_item.pathOptions = { offset: 5, borderRadius: 5 };
        return filtered_edge_item;
    });

    const newSolutions = _.each(solutions, function (solution_item) {
        if (selected_fn || selected_workflow) {
            if (
                selected_fn &&
                solution_item.functions.includes(selected_fn) &&
                selected_workflow &&
                solution_item.workflows.includes(selected_workflow)
            ) {
                solution_item.is_active = true;
            } else if (
                selected_fn &&
                solution_item.functions.includes(selected_fn) &&
                !selected_workflow
            ) {
                solution_item.is_active = true;
            } else {
                solution_item.is_active = false;
            }
        } else {
            solution_item.is_active = true;
        }

        if (activeSolutions.includes(solution_item.id) && solution_item.is_active) {
            solution_item.is_selected = true;
        } else {
            solution_item.is_selected = false;
        }
    });

    const newInitiatives = _.each(initiatives, function (initiative_item) {
        if (selected_fn || selected_workflow) {
            if (
                selected_fn &&
                initiative_item.functions.includes(selected_fn) &&
                selected_workflow &&
                initiative_item.workflows.includes(selected_workflow)
            ) {
                initiative_item.is_active = true;
            } else if (
                selected_fn &&
                initiative_item.functions.includes(selected_fn) &&
                !selected_workflow
            ) {
                initiative_item.is_active = true;
            } else {
                initiative_item.is_active = false;
            }
        } else {
            initiative_item.is_active = true;
        }
    });

    const selectSolution = (solutionIds) => {
        setActiveSolutions(solutionIds);
    };

    const onNodeClick = (event, node) => {
        if (node.node_type === 'function') {
            setSelectedWorkflow(false);
            setWorkflowStakeholders([]);
            if (stakeholdersView !== 'landscape') {
                setStakeholdersView('landscape');
            }
            if (selected_fn === node.id) {
                setSelectedFunction(false);
                startNodeAnimation(stakeholdersApi, { x: [100, 0] });
            } else {
                setSelectedFunction(node.id);
                startNodeAnimation(
                    businessWorkflowApi,
                    { x: [-100, 0] },
                    { velocity: 0, tension: 200 }
                );
                startNodeAnimation(stakeholdersApi, { x: [0, 100] });
            }
        } else if (node.node_type === 'workflow') {
            if (selected_workflow === node.id) {
                if (stakeholdersView !== 'landscape') {
                    setStakeholdersView('landscape');
                }
                setSelectedWorkflow(null);
                setWorkflowStakeholders([]);
                setActiveMetrics([]);
            } else {
                setSelectedWorkflow(node.id);
                if (stakeholdersView !== 'portrait') {
                    setStakeholdersView('portrait');
                }
                const workflowStakeholder = stakeholders.filter(
                    (stakeholder) =>
                        String(stakeholder.functions) === selected_fn &&
                        String(stakeholder.workflows) === node.id
                );

                const workflowMetrics = problemOverview.filter(
                    (overview) =>
                        String(overview.problem_definition_id) ===
                        String(node.problem_definition_id)
                );
                const metrics = workflowMetrics?.[0]?.metrics || [];
                setWorkflowStakeholders(workflowStakeholder);
                setActiveMetrics(metrics);
                startNodeAnimation(midYearInfoApi, { x: [-100, 0] });
                startNodeAnimation(midYearStakeholdersApi, { x: [500, 0] });
                startNodeAnimation(decisionFlowApi, { x: [400, 0] });
            }
        }
        setActiveSolutions([]);
    };

    const onClickDrawerToggle = () => {
        setShowDrawer(!show_drawer);
    };

    const toggleStyle = useSpring({
        right: show_drawer ? '50%' : '0%',
        rotate: show_drawer ? '180deg' : '0deg',
        transform: show_drawer ? 'translateX(-2rem)' : 'translateX(1rem)',
        config: {
            ...springConfig,
            duration: 1500
        }
    });
    const drawerStyle = useSpring({
        transform: show_drawer ? 'translateX(100%)' : 'translateX(200%)',
        opacity: show_drawer ? 1 : 0,
        config: {
            ...springConfig,
            duration: 1500
        }
    });

    const handleRedirection = (redirectionDetails) => {
        if (redirectionDetails?.toTabID) {
            setRedirectionReference((prevState) => ({ ...prevState, ...redirectionDetails }));
            setSelectedTab(redirectionDetails?.toTabID);
        }
    };

    useEffect(() => {
        setSelectedFunction(false);
        setSelectedWorkflow(false);
        if (redirectionReference?.toTabID !== selectedTab)
            setRedirectionReference({ ...initialRedirectionReference });
    }, [selectedTab]);

    return (
        <div className={classes.connSystemDashboardContainer}>
            <NavBar classList={classes} {...newProps} />
            <div className={classes.connSystemDashboardBody}>
                <div className={classes.connSystemDashboardTabContainer}>
                    <div
                        className={`${classes.connSystemDashboardTabLabel} ${
                            selectedTab === 0 && classes.connSystemDashboardTabLabelSelected
                        }`}
                        onClick={() => setSelectedTab(0)}
                    >
                        Value
                    </div>
                    <div
                        className={`${classes.connSystemDashboardTabLabel} ${
                            selectedTab === 1 && classes.connSystemDashboardTabLabelSelected
                        }`}
                        onClick={() => setSelectedTab(1)}
                    >
                        Intelligence
                    </div>
                    <div
                        className={`${classes.connSystemDashboardTabLabel} ${
                            selectedTab === 2 && classes.connSystemDashboardTabLabelSelected
                        }`}
                        onClick={() => setSelectedTab(2)}
                    >
                        Foundation
                    </div>
                    <br clear="all" />
                </div>
                <div className={classes.connSystemGridContainer}>
                    {selectedTab === 0 && (
                        <>
                            <div className={classes.connSystemGridTopBusinessProcess}>
                                <animated.div
                                    className={classes.connSystemGoals}
                                    style={goalSprings}
                                >
                                    <Goals goals={goals} heading={'GOALS'} />
                                </animated.div>
                                <div className={classes.connSystemInitiatives}>
                                    <Initiatives initiatives={newInitiatives} />
                                </div>
                            </div>

                            {oldDashboard ? (
                                <React.Fragment>
                                    <div className={classes.connSystemGridMiddle}>
                                        <div
                                            className={classes.connSystemBusinessProcess}
                                            style={{
                                                '--section-width':
                                                    stakeholdersView === 'portrait' ? '50%' : '28%'
                                            }}
                                        >
                                            <BusinessProcess
                                                classes={classes}
                                                nodes={nodes}
                                                edges={newEdges}
                                                onNodeClick={onNodeClick}
                                            />
                                        </div>

                                        {selected_workflow ? (
                                            <>
                                                <animated.div
                                                    className={classes.connSystemDecisionFlow}
                                                    style={decisionFlowSprings}
                                                >
                                                    <DecisionFlow
                                                        selectSolution={selectSolution}
                                                        selected_workflow={selected_workflow}
                                                    />
                                                </animated.div>
                                                <animated.div
                                                    style={drawerStyle}
                                                    className={classes.connSystemSideDrawer}
                                                >
                                                    <SideDrawer
                                                        selected_workflow={selected_workflow}
                                                    />
                                                </animated.div>
                                                <animated.button
                                                    style={toggleStyle}
                                                    className={classes.connSystemSideDrawerToggle}
                                                    onClick={onClickDrawerToggle}
                                                >
                                                    <ChevronLeft />
                                                </animated.button>
                                            </>
                                        ) : (
                                            <animated.div
                                                className={classes.connSystemStakeholders}
                                                style={stakeholdersSprings}
                                            >
                                                <Stakeholders
                                                    stakeholders={
                                                        workflowStakeholders.length
                                                            ? workflowStakeholders
                                                            : stakeholders
                                                    }
                                                    mode={stakeholdersView}
                                                    gridCols={3}
                                                />
                                            </animated.div>
                                        )}
                                    </div>
                                    <div className={classes.connSystemGridBottom}>
                                        <Solutions
                                            solutions={newSolutions}
                                            width={'100%'}
                                            border={true}
                                        />
                                    </div>
                                </React.Fragment>
                            ) : (
                                <BusinessLatest
                                    solutions={newSolutions}
                                    nodes={nodes}
                                    driverSprings={driverSprings}
                                    onNodeClick={onNodeClick}
                                    startNodeAnimation={startNodeAnimation}
                                    classList={classes}
                                    newEdges={newEdges}
                                    stakeHolders={
                                        workflowStakeholders.length
                                            ? workflowStakeholders
                                            : stakeholders
                                    }
                                    dashboardCode={dashboardCode}
                                    problemArea={problemArea}
                                    handleRedirection={handleRedirection} //Nested Props
                                />
                            )}
                        </>
                    )}
                    {selectedTab === 1 && (
                        <IntelligenceDataTab
                            classes={classes}
                            dashboardCode={dashboardCode}
                            redirectionReference={redirectionReference}
                        />
                    )}
                    {selectedTab === 2 && (
                        <FoundationDataTab
                            classList={classes}
                            nodes={nodes}
                            onNodeClick={onNodeClick}
                            newEdges={newEdges}
                            newSolutions={newSolutions}
                            code={dashboardCode}
                            redirectionReference={redirectionReference}
                        />
                    )}
                </div>
            </div>
            <Footer extraClasses={{ container: classes.connectedSystemFooter }} />
        </div>
    );
};

ConnectedSystemDashboard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(
    withStyles(
        (theme) => ({
            ...connSystemDashboardStyle(theme)
        }),
        { withTheme: true }
    )(ConnectedSystemDashboard)
);
