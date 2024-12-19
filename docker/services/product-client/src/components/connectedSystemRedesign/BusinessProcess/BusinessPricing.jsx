import React, { useEffect, useState } from 'react';
import businessProcessStyles from './BusinessProcessStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Close from '@material-ui/icons/CloseOutlined';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    ButtonGroup,
    Typography,
    Grid,
    withStyles,
    Tooltip
} from '@material-ui/core';
import KpiCard from 'components/connectedSystem/KpiCard';
import Intelligence from 'components/connectedSystem/SideDrawer/Intelligence';
import { ReactComponent as ScatterGraphSvg } from 'assets/img/scatterGraph.svg';
import Datasets from 'components/connectedSystem/SideDrawer/Datasets';
import Infrastructure from 'components/connectedSystem/SideDrawer/Infrastructure';
import StakeHolders from './StakeHolders';
import { animated, useSpring } from '@react-spring/web';
import { ReactComponent as DecisonFLow } from 'assets/img/decisionFlowIcon.svg';
import ModalComponent from 'components/connectedSystem/Intelligence/ModalComponent';
import AdvanceDecisionFlow from './AdvanceDecisionFlow';
import { getDecisionFlowData, getProblemOverview } from 'services/connectedSystem';
import clsx from 'clsx';
import LinearProgress from '@material-ui/core/LinearProgress';

// TODO: The following 3 static data variables will be removed once summary decision flow is generalized.
const redefineSummaryEdges = [
    {
        id: 'e8-9',
        source: '8',
        target: '9',
        color: '#FE6A9C',
        show: true,
        nodeId: '9',
        sourceHandle: 'c',
        targetHandle: 'd',
        screens: ['detailed', 'summary'],
        nodeIds: ['9']
    },
    {
        id: 'e9-10',
        source: '9',
        target: '10',
        color: '#FE6A9C',
        show: true,
        nodeId: '9',
        sourceHandle: 'c',
        targetHandle: 'd',
        screens: ['summary'],
        nodeIds: ['10']
    },
    {
        id: 'e10-11',
        source: '10',
        target: '11',
        color: '#FE6A9C',
        show: true,
        nodeId: '9',
        sourceHandle: 'c',
        targetHandle: 'd',
        screens: ['summary'],
        nodeIds: ['11']
    },
    {
        id: 'e9-17',
        source: '9',
        target: '17',
        nodeId: '9',
        color: '#FE6A9C',
        // show: true,
        sourceHandle: 'b',
        targetHandle: 'd',
        screens: ['detailed', 'summary'],
        nodeIds: ['9']
    },
    {
        id: 'e11-22',
        source: '11',
        target: '22',
        sourceHandle: 'c',
        color: '#FE6A9C',
        nodeIds: ['11'],
        targetHandle: 'd'
    },
    {
        id: 'e19-17',
        source: '19',
        target: '17',
        nodeId: '9',
        sourceHandle: 'h',
        targetHandle: 'i',
        screens: ['detailed', 'summary'],
        color: '#FE6A9C',
        nodeIds: ['9', '5']
        // show: true
    },
    {
        id: 'e17-19',
        source: '17',
        target: '19',
        nodeId: '9',
        sourceHandle: 'a',
        targetHandle: 't',
        screens: ['detailed', 'summary'],
        color: '#FE6A9C',
        nodeIds: ['9']
        // show: true
    },
    {
        id: 'e17-20',
        source: '17',
        target: '20',
        nodeId: '9',
        sourceHandle: 'f',
        targetHandle: 'g',
        screens: ['detailed', 'summary'],
        color: '#FE6A9C',
        nodeIds: ['9', '5']
        // show: true
    },
    {
        id: 'e20-22',
        source: '20',
        target: '22',
        nodeId: '9',
        sourceHandle: 'b',
        targetHandle: 'g',
        screens: ['detailed', 'summary'],
        color: '#FE6A9C',
        nodeIds: ['9', '5']
        // show: true
    },
    {
        id: 'e13-12',
        source: '13',
        target: '12',
        color: '#A2C73B',
        show: true,
        sourceHandle: 'k',
        targetHandle: 'p',
        nodeIds: ['12']
    },
    {
        id: 'e13-14',
        source: '13',
        target: '14',
        show: true,
        color: '#A2C73B',
        sourceHandle: 'b',
        targetHandle: 'g',
        nodeIds: ['14']
    },
    {
        id: 'e14-15',
        source: '14',
        target: '15',
        show: true,
        color: '#A2C73B',
        sourceHandle: 'k',
        targetHandle: 'p',
        nodeIds: ['15']
    },
    {
        id: 'e11-12',
        source: '11',
        target: '12',
        color: '#A2C73B',
        show: true,
        sourceHandle: 'v',
        targetHandle: 'n',
        nodeIds: ['12']
    },
    {
        id: 'e11-13',
        source: '11',
        target: '13',
        color: '#A2C73B',
        show: true,
        nodeId: '9',
        screens: ['summary'],
        sourceHandle: 'b',
        targetHandle: 'g',
        nodeIds: ['13']
    },
    {
        id: 'e10-12',
        source: '10',
        target: '12',
        color: '#A2C73B',
        show: true,
        nodeId: '9',
        screens: ['summary'],
        sourceHandle: 'b',
        targetHandle: 'g',
        nodeIds: ['12']
    },
    {
        id: 'e17-10',
        source: '17',
        target: '10',
        color: '#FE6A9C',
        sourceHandle: 'aa',
        targetHandle: 'g',
        nodeIds: ['5', '9', '10']
    }
];
const tradeDiscountNodes = [
    {
        id: '10',
        linkedProblemDefinitionId: 'wf_node_5',
        parentFnId: 'fn_node_2',
        linkedParentNodeIds: ['11', '12'],
        downstreamNodes: ['11', '12'],
        screens: ['summary'],
        text: 'Prioritize retail channels to drive changes',
        targetPosition: 'bottom',
        app_id: 1223,
        dashboard_id: 232,
        solution_id: [1, 5],
        color: '#FE6A9C',
        bgColor: 'rgba(254, 106, 156, 0.1)',
        position: { x: 835.9335558749706, y: 69.5902174673368 },
        type: 'custom'
    },
    {
        id: '11',
        linkedProblemDefinitionId: 'wf_node_5',
        parentFnId: 'fn_node_2',
        linkedParentNodeIds: ['12'],
        downstreamNodes: ['12', '13'],
        screens: ['summary'],
        text: 'Review/ Change current trade discount to accommodate price change',
        targetPosition: 'bottom',
        app_id: 1223,
        dashboard_id: 232,
        solution_id: [1, 5],
        color: '#FE6A9C',
        bgColor: 'rgba(254, 106, 156, 0.1)',
        position: { x: 738.2983832691729, y: 158.24101138094238 },
        type: 'custom'
    },
    {
        id: '12',
        linkedProblemDefinitionId: 'wf_node_6',
        parentFnId: 'fn_node_2',
        screens: ['summary'],
        text: 'Improve retail execution by ensuring price compliance',
        app_id: 1223,
        dashboard_id: 232,
        solution_id: [5, 7],
        color: '#A2C73B',
        bgColor: '#E8F1CE',
        position: { x: 572.9796663752624, y: 317.8448941110617 },
        type: 'custom'
    },
    {
        id: '13',
        linkedProblemDefinitionId: 'wf_node_6',
        parentFnId: 'fn_node_2',
        linkedParentNodeIds: ['12', '14'],
        downstreamNodes: ['12', '14'],
        screens: ['summary'],
        text: 'Assess & Improve Price Communication',
        app_id: 1223,
        dashboard_id: 232,
        solution_id: [3, 8],
        color: '#A2C73B',
        bgColor: '#E8F1CE',
        position: { x: 572.4347957116022, y: 405.9692873491831 },
        type: 'custom'
    },
    {
        id: '14',
        linkedProblemDefinitionId: 'wf_node_6',
        parentFnId: 'fn_node_2',
        linkedParentNodeIds: ['15'],
        downstreamNodes: ['15'],
        text: 'Benchmark brands commercial execution effectiveness w.r.to competition',
        sourcePosition: 'top',
        app_id: 1223,
        dashboard_id: 232,
        solution_id: [3],
        color: '#A2C73B',
        bgColor: '#E8F1CE',
        position: { x: 1081.8619844506156, y: 391.50713083309535 },
        type: 'custom'
    },
    {
        id: '15',
        linkedProblemDefinitionId: 'wf_node_6',
        parentFnId: 'fn_node_2',
        text: 'Refine trade terms for retailers based on measurements',
        targetPosition: 'bottom',
        app_id: 1223,
        dashboard_id: 232,
        solution_id: [4, 6],
        color: '#A2C73B',
        bgColor: '#E8F1CE',
        position: { x: 1082.4270061194902, y: 310.69280419622163 },
        type: 'custom'
    },
    {
        id: '21',
        linkedProblemDefinitionId: 'wf_node_4',
        parentFnId: 'fn_node_2',
        text: 'Commercial',
        decisionCategory: 24,
        head: true,
        subhead: true,
        app_id: 1223,
        dashboard_id: 232,
        solution_id: [2],
        icon: 'commercial',
        type: 'custom',
        position: { x: 826.0511747579677, y: 482.68507590519334 },
        styles: {
            fontSize: '2.5rem',
            fontWeight: 400
        }
    },

    {
        id: '22',
        linkedProblemDefinitionId: 'wf_node_5',
        parentFnId: 'fn_node_2',
        linkedParentNodeIds: ['9', '5', '11'],
        decisionCategory: 24,
        text: 'Update promo calendar & review mechanics with category managers',
        sourcePosition: 'top',
        app_id: 1223,
        dashboard_id: 232,
        solution_id: [4],
        color: '#FE6A9C',
        bgColor: 'rgba(212, 223, 249, 0.6)',
        position: { x: 859.3350209629104, y: 549.2303611796287 },
        type: 'custom'
    }
];
const tradeDiscountEdges = [
    {
        id: 'e10-11',
        source: '10',
        target: '11',
        color: '#FE6A9C',
        show: true,
        nodeId: '9',
        sourceHandle: 'c',
        targetHandle: 'd',
        screens: ['summary'],
        nodeIds: ['11']
    },
    {
        id: 'e13-14',
        source: '13',
        target: '14',
        show: true,
        color: '#A2C73B',
        sourceHandle: 'e',
        targetHandle: 'y',
        nodeIds: ['14']
    },
    {
        id: 'e14-15',
        source: '14',
        target: '15',
        show: true,
        color: '#A2C73B',
        sourceHandle: 'm',
        targetHandle: 'n',
        nodeIds: ['15']
    },
    {
        id: 'e11-12',
        source: '11',
        target: '12',
        color: '#FE6A9C',
        show: true,
        sourceHandle: 'w',
        targetHandle: 'z',
        nodeIds: ['12']
    },
    {
        id: 'e11-13',
        source: '11',
        target: '13',
        color: '#FE6A9C',
        show: true,
        nodeId: '9',
        screens: ['summary'],
        sourceHandle: 'c',
        targetHandle: 'r',
        nodeIds: ['13']
    },
    {
        id: 'e10-12',
        source: '10',
        target: '12',
        color: '#FE6A9C',
        show: true,
        nodeId: '9',
        screens: ['summary'],
        sourceHandle: 'w',
        targetHandle: 'l',
        nodeIds: ['12']
    },
    {
        id: 'e11-22',
        source: '11',
        target: '22',
        sourceHandle: 'b',
        color: '#FE6A9C',
        nodeIds: ['11'],
        targetHandle: 'r',
        type: 'positionaledge',
        spacing: 200
    },
    {
        id: 'e13-12',
        source: '13',
        target: '12',
        color: '#A2C73B',
        show: true,
        sourceHandle: 'k',
        targetHandle: 'p',
        nodeIds: ['12']
    }
];

const BusinessPricing = (props) => {
    const classes = props.classes;
    const [activeTab, setActiveTab] = useState('Decisions');
    const [expand, setExpand] = useState({});
    const [problemExpand, setProblemExpand] = useState(false);
    const [popupActiveTab, setPopupActiveTab] = useState('Detailed');
    const [openDecisionPopup, setOpenDecisionPopup] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [activeProblemDef, setActiveProblemDef] = useState({});
    const [decisionFlowData, setDecisionFlowData] = useState({});
    const [problemOverview, setProblemOverview] = useState({ metrics: [] });
    const [problemOverviewMetric, setProblemOverviewMetric] = useState([]);
    const [active, setActive] = useState({ active: null, progressValue: null });
    const [selectedStakeHolder, setSelectedStakeHolder] = useState(null);
    const [selectedModalStakeHolder, setSelectedModalStakeHolder] = useState(null);
    const [unactiveStakeholders, setUnactiveStakeholders] = useState({});
    const [innerWidth, innerHeight] = [window.innerWidth, window.innerHeight];
    const [activeProblemArea, setActiveProblemArea] = useState({});

    useEffect(() => {
        if (props?.problemArea && props?.selectedDriver) {
            let selectedProblemArea = props.problemArea.find((element) => {
                return element.ref_id === props.selectedDriver.ref_id;
            });
            setActiveProblemArea(selectedProblemArea);
        }
    }, [props.selectedDriver]);

    const [businessWorkflowSprings, businessWorkflowApi] = useSpring(() => ({
        from: { x: 300 }
    }));
    const [kpiSprings, kpiApi] = useSpring(() => ({
        from: { x: 300 }
    }));
    const [decisionSprings, decisionApi] = useSpring(() => ({
        from: { x: 900 }
    }));
    const [stakeHoldersSprings, stakeHoldersApi] = useSpring(() => ({
        from: { x: 300 }
    }));
    const handleChange = (e, val) => {
        setActive({ active: val.id });
        val.name === activeProblemDef?.name ? setActiveProblemDef({}) : setActiveProblemDef(val);
        let expandNew = { [val.name]: !expand[val.name] };
        setExpand(expandNew);
        let expandedPanels = 0;
        for (let i in expandNew) {
            if (expandNew[i]) {
                expandedPanels += 1;
            }
        }
        expandedPanels > 0 ? setProblemExpand(true) : setProblemExpand(false);
        props.onNodeClick(e, val);
        props.startNodeAnimation(stakeHoldersApi, { x: [300, 0] }, { velocity: 0, tension: 200 });
        props.startNodeAnimation(decisionApi, { x: [900, 0] }, { velocity: 0, tension: 200 });
    };

    const tabChange = (val) => {
        setActiveTab(val);
        props.startNodeAnimation(kpiApi, { x: [300, 0] }, { velocity: 0, tension: 200 });
    };

    const fetchDecisionFlowData = async () => {
        getDecisionFlowData(props.dashboardCode, 0, props?.selectedDriver?.id).then((response) => {
            setDecisionFlowData(response);
        });
    };

    const fetchProblemOverview = async () => {
        getProblemOverview(props.dashboardCode, 0).then((response) => {
            setProblemOverview(response);
        });
    };

    useEffect(() => {
        fetchDecisionFlowData();
        fetchProblemOverview();
        props.startNodeAnimation(
            businessWorkflowApi,
            { x: [300, 0] },
            { velocity: 0, tension: 200 }
        );
    }, []);

    useEffect(() => {
        const metric = problemOverview.metrics.filter(
            (metric) => metric.name === activeProblemDef.name
        )[0];
        if (metric) {
            const value = metric.data.filter((val) => val.label === '% Complete')[0].leftLevel[
                'data'
            ][0].data;
            setActive({ progressValue: value });
            setProblemOverviewMetric(metric);
        }
    }, [active]);

    useEffect(() => {
        if (openDecisionPopup === false) setPopupActiveTab('Detailed');
    }, [openDecisionPopup]);

    const openPopupHandler = (nodeId) => {
        setOpenDecisionPopup(true);
        setSelectedNodeId(nodeId);
    };

    const selectedNodeIdHandler = (nodeId) => {
        setSelectedNodeId(nodeId);
    };

    const decisionLegends = [
        { text: 'Yearly pricing strategy - Category specific', color: '#FFA57E' },
        { text: 'Mid Year Review', color: '#FE6A9C' },
        { text: 'Measurement', color: '#A2C73B' }
    ];

    const handleDecisionClick = () => {
        setSelectedNodeId(null);
        setOpenDecisionPopup(true);
    };

    const filterStakeholders = (stakeholders, functionId = '', activeProblemDefId = '') => {
        const updatedFunctionId = functionId.split('_')[2];
        if (!activeProblemDefId) return [];
        return stakeholders.filter(({ functions }) => functions == updatedFunctionId);
    };
    const renderAccrodianItem = (name) => {
        if (Object.keys(activeProblemDef).length > 0) {
            return activeProblemDef.name === name;
        }
        return true;
    };
    const clickHandler = (section) => {
        tabChange(section);
        setUnactiveStakeholders({
            ...unactiveStakeholders,
            [activeProblemDef.id]: []
        });
    };

    const getDetailedFlowHeight = () => {
        switch (true) {
            case innerHeight <= 500 && innerWidth >= 1100:
                return '250vh';
            case innerHeight <= 600 && innerWidth >= 900:
                return '180vh';
            case innerHeight <= 700 && innerWidth >= 1100:
                return '195vh';
            case innerHeight <= 1000 && innerWidth <= 1400:
                return '150vh';
            case innerWidth <= 1160:
                return '160vh';
            default:
                return '190vh';
        }
    };

    const getDecisionFlowHeight = (val) => {
        let decisionHeight;
        switch (true) {
            case innerWidth > 1890:
                decisionHeight =
                    val.id == 'wf_node_6' ? '65vw' : val.id == 'wf_node_4' ? '60vw' : '61vw';
                return decisionHeight;
            case innerWidth <= 1030 || (innerHeight < 1000 && innerWidth <= 1300):
                decisionHeight = val.id == 'wf_node_4' ? '55vw' : '56vw';
                return decisionHeight;

            default:
                decisionHeight = val.id == 'wf_node_4' ? '60vw' : '61vw';
                return decisionHeight;
        }
    };

    return (
        <animated.div className={classes.midContainer} style={{ ...businessWorkflowSprings }}>
            <div className={classes.pricingContainer}>
                <Typography className={classes.businessPricingHeader}>
                    Business Process - Pricing
                </Typography>
                <Tooltip
                    title={'Select the business process to check the decisions and the KPI’s'}
                    classes={{ tooltip: classes.toolTipStyle, arrow: classes.arrowStyle }}
                    arrow={true}
                    disableHoverListener={!(Object.keys(activeProblemDef).length === 0)}
                >
                    <ButtonGroup
                        disabled={Object.keys(activeProblemDef).length === 0}
                        className={clsx(
                            classes.foundation_buttonGroup,
                            Object.keys(activeProblemDef).length === 0
                                ? classes.foundation_buttonGroup_disabled
                                : 'none'
                        )}
                    >
                        <Button
                            onClick={() => clickHandler('Decisions')}
                            variant={activeTab === 'Decisions' ? 'contained' : 'outlined'}
                            style={{ textTransform: 'none' }}
                            aria-label="Decisions"
                        >
                            Decisions
                        </Button>
                        <Button
                            onClick={() => clickHandler('KPI')}
                            variant={activeTab === 'KPI' ? 'contained' : 'outlined'}
                            style={{ textTransform: 'none' }}
                            aria-label="KPI"
                        >
                            KPI&apos;s
                        </Button>
                    </ButtonGroup>
                </Tooltip>
            </div>

            <Grid container className={classes.problemAreaContainer}>
                <Grid container style={{ display: 'block' }}>
                    {activeProblemArea?.problemDefinition?.map((val, key) => {
                        const filteredStakeholders = filterStakeholders(
                            props.stakeHolders,
                            val.parent_fn_id,
                            activeProblemDef.id
                        );
                        return renderAccrodianItem(val.name) ? (
                            <Grid
                                item
                                xs={12}
                                key={`pricing${key}`}
                                className={classes.pricingAccordionContainer}
                            >
                                <Accordion
                                    expanded={expand[val.name] ? true : false}
                                    className={classes.pricingAccordion}
                                >
                                    <AccordionSummary
                                        className={
                                            expand[val.name]
                                                ? classes.pricingItemContainerEnabled
                                                : classes.pricingItemContainer
                                        }
                                        expandIcon={
                                            activeProblemDef.name ? (
                                                <Close className={classes.expandIcon} />
                                            ) : (
                                                <ExpandMoreIcon className={classes.expandIcon} />
                                            )
                                        }
                                        onClick={(e) => handleChange(e, val)}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography
                                            className={
                                                expand[val.name]
                                                    ? classes.pricingAccordionHeadingEnabled
                                                    : problemExpand
                                                    ? classes.pricingAccordionHeadingDisabled
                                                    : classes.pricingAccordionHeading
                                            }
                                        >
                                            {val?.name}
                                        </Typography>
                                        {val.id === activeProblemDef.id &&
                                            problemOverviewMetric.data && (
                                                <div className={classes.progressBarDiv}>
                                                    <div className={classes.progressBar}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={parseInt(active.progressValue)}
                                                            className={classes.linearProgress}
                                                        />
                                                    </div>

                                                    <Typography
                                                        className={classes.completeText}
                                                    >{`${parseInt(
                                                        active.progressValue
                                                    )}% Complete`}</Typography>
                                                </div>
                                            )}
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.accordionDetailsContainer}>
                                        <animated.div
                                            className={classes.pricingKpiHolder}
                                            style={{ ...stakeHoldersSprings }}
                                        >
                                            <div className={classes.div}>
                                                {problemOverviewMetric.data &&
                                                    problemOverviewMetric?.data.map((val, key) => (
                                                        <KpiCard
                                                            key={`kpi${key}`}
                                                            item={val}
                                                            border="none"
                                                            background="transparent"
                                                            title={{
                                                                fontSize: '1.75rem',
                                                                fontSizeLg: '1.75rem',
                                                                fontSizeXl: '1.75rem',
                                                                fontWeight: 400,
                                                                letterSpacing: '1px',
                                                                marginTop: '0.5rem'
                                                            }}
                                                            descriptiveHeading={{
                                                                fontSize: '2.25rem',
                                                                fontSizeLg: '2.25rem',
                                                                fontSizeXl: '2.25rem',
                                                                fontWeight: 400
                                                            }}
                                                            leftContainer={{
                                                                marginTop: '0rem',
                                                                justifyContent: 'flex-start'
                                                            }}
                                                            height={'8rem'}
                                                            width="45%"
                                                            minWidth="45%"
                                                            bottomPadding="0rem"
                                                            bottomDivMarginTop="0rem"
                                                        />
                                                    ))}
                                            </div>

                                            <StakeHolders
                                                stakeholders={filteredStakeholders}
                                                setSelectedStakeHolder={(stakeholder) =>
                                                    setSelectedStakeHolder(stakeholder)
                                                }
                                                selectedStakeHolder={selectedStakeHolder}
                                                unactiveStakeholders={unactiveStakeholders[val.id]}
                                            />
                                        </animated.div>
                                        {activeTab === 'KPI' && (
                                            <animated.div
                                                className={classes.kpiCardsHolder}
                                                style={{ ...kpiSprings }}
                                            >
                                                <div className={classes.kpiCardsItem}>
                                                    <ScatterGraphSvg className={classes.svgStyle} />
                                                    <Intelligence
                                                        data={problemOverview.kpiOverview}
                                                        activeProblemDef={activeProblemDef}
                                                        activeFunction={activeProblemArea}
                                                        handleRedirection={props.handleRedirection} //Nested Props
                                                    />
                                                </div>
                                                <div className={classes.kpiCardsItem}>
                                                    <ScatterGraphSvg className={classes.svgStyle} />
                                                    <Datasets
                                                        data={problemOverview.kpiOverview}
                                                        activeProblemDef={activeProblemDef}
                                                        activeFunction={activeProblemArea}
                                                        handleRedirection={props.handleRedirection} //Nested Props
                                                    />
                                                </div>
                                                <div className={classes.kpiCardsItem}>
                                                    <ScatterGraphSvg className={classes.svgStyle} />
                                                    <Infrastructure
                                                        data={problemOverview.kpiOverview}
                                                        activeProblemDef={activeProblemDef}
                                                        activeFunction={activeProblemArea}
                                                        handleRedirection={props.handleRedirection} //Nested Props
                                                    />
                                                </div>
                                            </animated.div>
                                        )}
                                        {activeTab === 'Decisions' && (
                                            <>
                                                <animated.div
                                                    className={classes.decisionFlowHolder}
                                                    style={{ ...decisionSprings }}
                                                >
                                                    <Typography
                                                        className={classes.decisionsFlowHead}
                                                        style={
                                                            val.id === 'wf_node_5'
                                                                ? { paddingLeft: '2.3rem' }
                                                                : {}
                                                        }
                                                    >
                                                        Decision Flow{' '}
                                                        <DecisonFLow
                                                            onClick={handleDecisionClick}
                                                            className={classes.decisionsFlowIcon}
                                                        />
                                                    </Typography>
                                                    <div>
                                                        <AdvanceDecisionFlow
                                                            x={0.01}
                                                            y={-0.6}
                                                            yIncIndexForHead={-0.6}
                                                            showAxisHeaders={false}
                                                            openPopupHandler={openPopupHandler}
                                                            data={decisionFlowData}
                                                            linkedProblemDefinitionId={val.id}
                                                            screen="decisions"
                                                            parentFnId={val.parent_fn_id}
                                                            activeProblemDefId={activeProblemDef.id}
                                                            width={getDecisionFlowHeight(val)}
                                                            height={
                                                                val.id == 'wf_node_5'
                                                                    ? innerWidth <= 1500 &&
                                                                      innerHeight > 600
                                                                        ? '35vh'
                                                                        : '40vh'
                                                                    : '27vh'
                                                            }
                                                            onTabClick={(e, problemDefinition) => {
                                                                handleChange(e, problemDefinition);
                                                            }}
                                                            problemDefinitions={
                                                                activeProblemArea?.problemDefinition
                                                            }
                                                            selectedStakeHolder={
                                                                selectedStakeHolder
                                                            }
                                                            stakeholders={props.stakeHolders}
                                                            setSelectedStakeHolder={
                                                                setSelectedStakeHolder
                                                            }
                                                            setUnactiveStakeholders={
                                                                setUnactiveStakeholders
                                                            }
                                                            unactiveStakeholders={
                                                                unactiveStakeholders
                                                            }
                                                            driver={props.selectedDriver}
                                                        />
                                                    </div>
                                                </animated.div>
                                                {openDecisionPopup && (
                                                    <ModalComponent
                                                        dialogTitleClassName={
                                                            classes.dialogTitleCustomStyles
                                                        }
                                                        dialogContentClassName={
                                                            classes.dialogContentCustomStyle
                                                        }
                                                        openDialogue={openDecisionPopup}
                                                        setOpenDialogue={setOpenDecisionPopup}
                                                        maxWidth={false}
                                                        fullScreen={true}
                                                        title={'Decision Flow'}
                                                        dialogCloseButtonClassName={
                                                            classes.dialogIconCustomStyle
                                                        }
                                                        modalStakeHolder={true}
                                                    >
                                                        <>
                                                            <div className={classes.modelWrapper}>
                                                                <div
                                                                    className={
                                                                        classes.modelContainer
                                                                    }
                                                                >
                                                                    {decisionLegends.map(
                                                                        (
                                                                            { text, color },
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <div
                                                                                    key={`${text}-${color}-${index}`}
                                                                                    style={{
                                                                                        display:
                                                                                            'flex',
                                                                                        gap: '10px',
                                                                                        alignItems:
                                                                                            'center'
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            width: '15px',
                                                                                            height: '15px',
                                                                                            background:
                                                                                                color,
                                                                                            borderRadius:
                                                                                                '2px'
                                                                                        }}
                                                                                    />
                                                                                    {text}
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                                <ButtonGroup
                                                                    className={clsx(
                                                                        classes.foundation_buttonGroup,
                                                                        !selectedNodeId
                                                                            ? classes.foundation_buttonGroup_disabled
                                                                            : 'none'
                                                                    )}
                                                                    disabled={!selectedNodeId}
                                                                >
                                                                    <Button
                                                                        onClick={() =>
                                                                            setPopupActiveTab(
                                                                                'Detailed'
                                                                            )
                                                                        }
                                                                        variant={
                                                                            popupActiveTab ===
                                                                            'Detailed'
                                                                                ? 'contained'
                                                                                : 'outlined'
                                                                        }
                                                                        style={{
                                                                            textTransform: 'none'
                                                                        }}
                                                                        aria-label="Detailed"
                                                                    >
                                                                        Detailed
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() =>
                                                                            setPopupActiveTab(
                                                                                'Summary'
                                                                            )
                                                                        }
                                                                        variant={
                                                                            popupActiveTab ===
                                                                            'Summary'
                                                                                ? 'contained'
                                                                                : 'outlined'
                                                                        }
                                                                        style={{
                                                                            textTransform: 'none'
                                                                        }}
                                                                        aria-label="Summary"
                                                                    >
                                                                        Summary
                                                                    </Button>
                                                                </ButtonGroup>
                                                            </div>
                                                            <div
                                                                className={
                                                                    classes.modalStakeHolderContainer
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        classes.modalStakeHolder
                                                                    }
                                                                >
                                                                    <StakeHolders
                                                                        modalStakeHolder={true}
                                                                        stakeholders={
                                                                            filteredStakeholders
                                                                        }
                                                                        setSelectedStakeHolder={(
                                                                            stakeholder
                                                                        ) =>
                                                                            setSelectedModalStakeHolder(
                                                                                stakeholder
                                                                            )
                                                                        }
                                                                        selectedStakeHolder={
                                                                            selectedModalStakeHolder
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            {popupActiveTab === 'Detailed' && (
                                                                <div
                                                                    className={
                                                                        classes.popupFlowWrapper
                                                                    }
                                                                >
                                                                    <AdvanceDecisionFlow
                                                                        x={-1}
                                                                        height={getDetailedFlowHeight()}
                                                                        width="97vw"
                                                                        showAxisHeaders={false}
                                                                        data={decisionFlowData}
                                                                        screen="detailed"
                                                                        selectedNodeId={
                                                                            selectedNodeId
                                                                        }
                                                                        selectedNodeIdHandler={
                                                                            selectedNodeIdHandler
                                                                        }
                                                                        stakeholders={
                                                                            filteredStakeholders
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                            {popupActiveTab === 'Summary' && (
                                                                <div>
                                                                    <AdvanceDecisionFlow
                                                                        y={0}
                                                                        x={0}
                                                                        yInc={120}
                                                                        // height="80vh"
                                                                        data={decisionFlowData}
                                                                        screen="summary"
                                                                        selectedNodeId={
                                                                            selectedNodeId
                                                                        }
                                                                        customData={{
                                                                            redefineSummaryEdges,
                                                                            tradeDiscountNodes,
                                                                            tradeDiscountEdges
                                                                        }}
                                                                        stakeholders={
                                                                            filteredStakeholders
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </>
                                                    </ModalComponent>
                                                )}
                                            </>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        ) : null;
                    })}
                </Grid>
            </Grid>
        </animated.div>
    );
};

export default withStyles(businessProcessStyles, { withTheme: true })(BusinessPricing);
