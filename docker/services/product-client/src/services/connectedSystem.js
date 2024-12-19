import { MarkerType } from 'reactflow';
export async function getProblemAreas(dashboard_code, tab) {
    let data;
    const businessProcesses = await import(
        `./connSystemJson/${dashboard_code}/businessProcesses.json`
    );
    const foundationDataBusinessProcess = await import(
        `./connSystemJson/${dashboard_code}/foundationDataBusinessProcess.json`
    );
    const intelligenceDataBusinessProcess = await import(
        `./connSystemJson/${dashboard_code}/intelligenceDataBusinessProcess.json`
    );

    switch (tab) {
        case 1:
            data = intelligenceDataBusinessProcess.data;
            break;
        case 2:
            data = foundationDataBusinessProcess.data;
            break;
        default:
            data = businessProcesses.data;
    }
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0);
    });
}

export const getProblemOverview = async (dashboardCode, tab, subTab = null) => {
    let data;
    const problemOverview = await import(`./connSystemJson/${dashboardCode}/problemOverview.json`);
    const intelligenceProblemOverview = await import(
        `./connSystemJson/${dashboardCode}/intelligenceProblemOverview.json`
    );
    const foundationBusinessProblemOverview = await import(
        `./connSystemJson/${dashboardCode}/foundationBusinessProblemOverview.json`
    );
    const foundationDataProblemOverview = await import(
        `./connSystemJson/${dashboardCode}/foundationDataProblemOverview.json`
    );
    const businessProblemOverview = await import(
        `./connSystemJson/${dashboardCode}/businessProblemOverview.json`
    );

    switch (tab) {
        case 0:
            data = businessProblemOverview.data;
            break;
        case 1:
            data = intelligenceProblemOverview.data;
            break;
        case 2:
            data =
                subTab === 'data'
                    ? foundationDataProblemOverview.data
                    : foundationBusinessProblemOverview.data;
            break;
        default:
            data = problemOverview.data;
    }
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0);
    });
};

export async function getInitiativesAndGoals(dashboardCode, tab, subTab = null) {
    const goalsAndInitiatives = await import(
        `./connSystemJson/${dashboardCode}/goalsAndInitiatives.json`
    );
    const intelligenceGoalsAndInitiatives = await import(
        `./connSystemJson/${dashboardCode}/intelligenceGoalsAndInitiatives.json`
    );
    const foundationBusinessGoalsAndInitiatives = await import(
        `./connSystemJson/${dashboardCode}/foundationBusinessGoalsAndInitiatives.json`
    );
    const foundationDataGoalsAndInitiatives = await import(
        `./connSystemJson/${dashboardCode}/foundationDataGoalsAndInitiatives.json`
    );
    let data;

    switch (tab) {
        case 1:
            data = intelligenceGoalsAndInitiatives.data;
            break;
        case 2:
            data =
                subTab === 'data'
                    ? foundationDataGoalsAndInitiatives.data
                    : foundationBusinessGoalsAndInitiatives.data;
            break;
        default:
            data = goalsAndInitiatives.data;
    }

    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0);
    });
}

export const getSolutions = async (dashboardCode, tab) => {
    let data;
    const solutions = await import(`./connSystemJson/${dashboardCode}/solutions.json`);
    const intelligenceSolutions = await import(
        `./connSystemJson/${dashboardCode}/intelligenceSolutions.json`
    );
    const foundationSolutions = await import(
        `./connSystemJson/${dashboardCode}/foundationSolutions.json`
    );

    switch (tab) {
        case 1:
            data = intelligenceSolutions.data;
            break;
        case 2:
            data = foundationSolutions.data;
            break;
        default:
            data = solutions.data;
    }

    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0);
    });
};

export const getArchitectureData = async (dashboard_code) => {
    let data;
    const architectureData = await import(
        `./connSystemJson/${dashboard_code}/architectureData.json`
    );
    data = architectureData;

    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0);
    });
};

export const getInsights = async (dashboardCode, tab) => {
    let data;
    const foundationInsights = await import(
        `./connSystemJson/${dashboardCode}/foundationInsights.json`
    );
    const intelligenceInsights = await import(
        `./connSystemJson/${dashboardCode}/intelligenceInsights.json`
    );

    switch (tab) {
        case 1:
            data = intelligenceInsights.data;
            break;
        case 2:
            data = foundationInsights.data;
            break;
        default:
            data = intelligenceInsights.data;
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 0);
    });
};

export const getDecisionFlowData = async (dashboardCode, tab, pId) => {
    let data;
    const decisionFlow = await import(`./connSystemJson/${dashboardCode}/decisionFlow.json`);
    let flowData = decisionFlow.data;
    const foundationBusinessDecisionFlow = await import(
        `./connSystemJson/${dashboardCode}/foundationBusinessDecisionFlow.json`
    );

    const decisionValue = await import(`./connSystemJson/${dashboardCode}/cpgDecisions.json`);

    let decisions = decisionValue.decisions.filter((el) => el.id === pId);
    flowData['decisions'] = decisions[0];
    switch (tab) {
        case 0:
            data = flowData;
            break;
        case 2:
            data = foundationBusinessDecisionFlow.data;
            break;
        default:
            data = decisionFlow.data;
    }

    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 0);
    });
};

// TODO: Remove the following once the older decision flow UX is completely deprecated.
export const getDecisionFlow = ({ callback = () => {} }) => {
    try {
        const response = {
            data: {
                title: 'Key Decides',
                id: 22,
                problem_definition_id: 122,
                decisions: {
                    nodes: [
                        {
                            id: '1',
                            text: 'What is the current price ladder at Retailer A?',
                            isSelected: true,
                            targetPosition: 'bottom',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [1, 3]
                        },
                        {
                            id: '2',
                            text: 'Is my current price point yielding the right return (GPaL Targets)?',
                            isSelected: true,
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [1, 4]
                        },
                        {
                            id: '3',
                            text: 'How much can I increase the price in H1 without impacting volume?',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [1]
                        },
                        {
                            id: '4',
                            text: 'Did price increase impact a key objective for the year?',
                            sourcePosition: 'top',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [1]
                        },
                        {
                            id: '5',
                            text: 'What is the lift observed from past promotions of similar nature?',
                            targetPosition: 'bottom',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [2, 4]
                        },
                        {
                            id: '6',
                            text: 'Can I offset this volume loss by a deeper promotion to stir sales?',
                            // sourcePosition: 'left',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [2, 6]
                        },
                        {
                            id: '7',
                            text: 'Set Promo Type, Duration, Depth of discount for ideal volume targets',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [2]
                        },
                        {
                            id: '8',
                            text: 'Assess promo cost & effectiveness - comparative study',
                            sourcePosition: 'top',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [2, 6]
                        },
                        {
                            id: '9',
                            text: 'What is the contribution of promo to demand?',
                            targetPosition: 'bottom',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [1, 5]
                        },
                        {
                            id: '10',
                            text: 'What is the additional demand / demand change driven by promo',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [5, 7]
                        },
                        {
                            id: '11',
                            text: 'Dynamically allocate distribution to ensure availability during & post event',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [3, 8]
                        },
                        {
                            id: '12',
                            text: 'Did the change in spend mix result in higher margin?',
                            sourcePosition: 'top',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [3]
                        },
                        {
                            id: '13',
                            text: 'What are the assumed flow levels across products and retailers',
                            targetPosition: 'bottom',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [4, 6]
                        },
                        {
                            id: '14',
                            text: 'What is the additional demand driven through interventions',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [4]
                        },
                        {
                            id: '15',
                            text: 'Dynamically allocate distribution to ensure availability during & post event',
                            sourcePosition: 'top',
                            app_id: 1223,
                            dashboard_id: 232,
                            solution_id: [4]
                        }
                    ],
                    edges: [
                        { id: 'e1-2', source: '1', target: '2' },
                        { id: 'e2-3', source: '2', target: '3' },
                        { id: 'e3-4', source: '3', target: '4' },
                        { id: 'e3-6', source: '3', target: '6' },
                        { id: 'e5-6', source: '5', target: '6' },
                        { id: 'e6-5', source: '6', target: '5' },
                        { id: 'e6-7', source: '6', target: '7' },
                        { id: 'e7-8', source: '7', target: '8' },
                        { id: 'e7-10', source: '7', target: '10' },
                        { id: 'e9-10', source: '9', target: '10' },
                        { id: 'e10-11', source: '10', target: '11' },
                        { id: 'e10-14', source: '10', target: '14' },
                        { id: 'e11-12', source: '11', target: '12' },
                        { id: 'e13-14', source: '13', target: '14' },
                        { id: 'e14-15', source: '14', target: '15' }
                    ]
                }
            }
        };
        callback(response.data);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getStakeholders = async (dashboardCode) => {
    const stakeholders = await import(`./connSystemJson/${dashboardCode}/stakeholders.json`);
    return new Promise((resolve) => {
        setTimeout(() => resolve(stakeholders.data), 0);
    });
};

export const getRedesignConnSystemData = () => {
    try {
        const response = {
            data: {
                initiatives: [
                    {
                        data: 'intiative',
                        heading: 'NSV',
                        record: '$60M',
                        recordData: '4.9%',
                        target: '$180M'
                    },
                    {
                        data: 'intiative',
                        heading: 'EBITDA',
                        record: '$8M',
                        recordData: '2.7%',
                        target: '$24M'
                    },
                    {
                        data: 'intiative',
                        heading: 'Frequency Weekly(%)',
                        record: '33%',
                        recordData: '33%'
                    },
                    {
                        data: 'intiative',
                        heading: 'Profiltable Transactions',
                        record: '1.2M',
                        recordData: '20%'
                    }
                ],
                insights: [
                    {
                        data: 'insight',
                        record: 'Weekly purchase frequency for Entry SKU dropped by 5% across large format stores over Q2 driven by higher price in a high inflation period',
                        status: 'Negative'
                    },
                    {
                        data: 'insight',
                        record: 'NSV from immediate consumption packs have tumbles by 10% possibly driven by high prices in Q2',
                        status: 'Negative'
                    },
                    {
                        data: 'insight',
                        record: '40% of the SKUs in Category 1 have profitable transactions indicating a positive trend towards targets',
                        status: 'Negative'
                    },
                    {
                        data: 'insight',
                        record: 'Weekly purchase frequency for Entry SKU dropped by 5% across large format stores over Q2 driven by higher price in a high inflation period',
                        status: 'Negative'
                    },
                    {
                        data: 'insight',
                        record: 'NSV from immediate consumption packs have tumbles by 10% possibly driven by high prices in Q2',
                        status: 'Positive'
                    },
                    {
                        data: 'insight',
                        record: '40% of the SKUs in Category 1 have profitable transactions indicating a positive trend towards targets',
                        status: 'Positive'
                    }
                ],
                drivers: [
                    {
                        id: 1,
                        name: 'Price',
                        process: [
                            {
                                id: 1,
                                name: 'Yearly Strategy Pricing-Category Specific',
                                due: 'Nov 15',
                                progress: 100,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'effectiveness for affordability, penetration & frequency at channel level',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'VP RGM',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 1,
                                                    name: 'Pack roles Analysis',
                                                    link: 'https://nuclios.mathco.com/app/1483/pack-roles-definition',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'To support businessess to understand assortment segment performance across brand, pack,price, channels to optimize assortment and evaluate impact of assortment decisions'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'by isolating shopper activation and promotion impact on target segments to find impact of price',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Sr. Director RGM',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 2,
                                                    name: 'Price Analyzer',
                                                    link: 'https://nuclios.mathco.com/app/1483/opportunity-identification/price-diagnostics',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'To support businessess to understand assortment segment performance across brand, pack,price, channels to optimize assortment and evaluate impact of assortment decisions'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'for different market scenarios, elasticities & macroeconomic indicators and finalize optimal plan',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Director - Pricing',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 3,
                                                    name: 'Price Analyzer',
                                                    link: 'https://nuclios.mathco.com/app/1525/brand-analyzer/company-overview',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Evaluate pricing structure, identify areas for improvement, analyze market trends, historic information. Anomaly detection and its impact on sales'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'of price change and approve if within guidelines',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Director - Pricing',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 4,
                                                    name: 'Price Analyzer',
                                                    link: 'https://nuclios.mathco.com/app/1525/brand-analyzer/market-overview',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Evaluate pricing structure, identify areas for improvement, analyze market trends, historic information. Anomaly detection and its impact on sales'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '5',
                                        position: { x: 1320, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '5',
                                            heading: 'Rollout',
                                            description:
                                                'for channels with most impact and assess effectiveness before global rollout',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Sr. Director RGM',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 5,
                                                    name: 'Price Analyzer',
                                                    link: 'https://nuclios.mathco.com/app/1525/sku-analyzer/sku-segmentation',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Evaluate pricing structure, identify areas for improvement, analyze market trends, historic information. Anomaly detection and its impact on sales'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-4',
                                        source: '4',
                                        target: '5',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ],
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'Pack roles Analysis',
                                        link: 'https://nuclios.mathco.com/app/1483/pack-roles-definition',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'To support businessess to understand assortment segment performance across brand, pack,price, channels to optimize assortment and evaluate impact of assortment decisions'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Price Analyzer',
                                        link: 'https://nuclios.mathco.com/app/1483/opportunity-identification/price-diagnostics',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'To support businessess to understand assortment segment performance across brand, pack,price, channels to optimize assortment and evaluate impact of assortment decisions'
                                            }
                                        ]
                                    },
                                    {
                                        id: 3,
                                        name: 'Price Analyzer',
                                        link: 'https://nuclios.mathco.com/app/1525/brand-analyzer/company-overview',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate pricing structure, identify areas for improvement, analyze market trends, historic information. Anomaly detection and its impact on sales'
                                            }
                                        ]
                                    },
                                    {
                                        id: 4,
                                        name: 'Price Analyzer',
                                        link: 'https://nuclios.mathco.com/app/1525/brand-analyzer/market-overview',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate pricing structure, identify areas for improvement, analyze market trends, historic information. Anomaly detection and its impact on sales'
                                            }
                                        ]
                                    },
                                    {
                                        id: 5,
                                        name: 'Price Analyzer',
                                        link: 'https://nuclios.mathco.com/app/1525/sku-analyzer/sku-segmentation',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate pricing structure, identify areas for improvement, analyze market trends, historic information. Anomaly detection and its impact on sales'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: 'Quarterly/ Mid-Year Price Review',
                                due: 'Feb 20',
                                progress: 20,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'Price Analyzer',
                                        link: 'https://nuclios.mathco.com/app/1525/sku-analyzer/sku-analyses',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate pricing structure, identify areas for improvement, analyze market trends, historic information. Anomaly detection and its impact on sales'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Price Elasticity',
                                        link: 'https://nuclios.mathco.com/app/1200/dashboard',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate price ladders, understand price index and elasticities. Understand how consumers respond to change in price. Measure of how sensitive the quantity demanded of a good is to changes in its price. Used to identify substitutes and complements.'
                                            }
                                        ]
                                    },
                                    {
                                        id: 3,
                                        name: 'Price Simulation And Optimization',
                                        link: 'https://nuclios.mathco.com/app/1236/price-simulation/scenario-comparison',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Perform Price Point Optimization. Leverage Brandwise Subcategory level elasticity, Cross-price elasticity, volume share vs profit to understand how to best optimize value and volume share by tweaking price. Compare various scenarios and choose the best price change to get the desired result.'
                                            }
                                        ]
                                    },
                                    {
                                        id: 7,
                                        name: 'Price Guidance',
                                        link: 'https://nuclios.mathco.com/app/1691',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Use the Price Guidance to create a plan'
                                            }
                                        ],
                                        powerBi: true
                                    },
                                    {
                                        id: 8,
                                        name: '	Channel Shelf Price Tracker',
                                        link: 'https://nuclios.mathco.com/app/1692',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Simulate using the price tracker to create an optimum plan'
                                            }
                                        ],
                                        salesForce: true
                                    },
                                    {
                                        id: 9,
                                        name: 'Price planning suite',
                                        link: 'https://app.powerbi.com/groups/me/reports/75e563bb-9346-4f08-a11d-1014e135b3d8/ReportSectionc244f6412cf6075440b9?ctid=4bf30310-e4f1-4658-9e34-9e8a5a193ed1&experience=power-bi',
                                        data: [
                                            {
                                                id: 1,
                                                name: ''
                                            }
                                        ],
                                        powerBi: true
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'effectiveness for affordability, penetration & frequency at channel level',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'Sr. Manager - Pricing',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 1,
                                                    name: 'Price Analyzer',
                                                    link: 'https://nuclios.mathco.com/app/1525/sku-analyzer/sku-analyses',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Evaluate pricing structure, identify areas for improvement, analyze market trends, historic information. Anomaly detection and its impact on sales'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'by isolating shopper activation and promotion impact on target segments to find impact of price',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Director - Pricing',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 2,
                                                    name: 'Price Elasticity',
                                                    link: 'https://nuclios.mathco.com/app/1200/dashboard',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Evaluate price ladders, understand price index and elasticities. Understand how consumers respond to change in price. Measure of how sensitive the quantity demanded of a good is to changes in its price. Used to identify substitutes and complements.'
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 7,
                                                    name: 'Price Guidance',
                                                    link: 'https://nuclios.mathco.com/app/1691',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Use the Price Guidance to create a plan'
                                                        }
                                                    ],
                                                    powerBi: true
                                                },
                                                {
                                                    id: 9,
                                                    name: 'Price planning suite',
                                                    link: 'https://app.powerbi.com/groups/me/reports/75e563bb-9346-4f08-a11d-1014e135b3d8/ReportSectionc244f6412cf6075440b9?ctid=4bf30310-e4f1-4658-9e34-9e8a5a193ed1&experience=power-bi',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: ''
                                                        }
                                                    ],
                                                    powerBi: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'for different market scenarios, elasticities & macroeconomic indicators and finalize optimal plan',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Sr. Director RGM',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 3,
                                                    name: 'Price Simulation And Optimization',
                                                    link: 'https://nuclios.mathco.com/app/1236/price-simulation/simulation',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Perform Price Point Optimization. Leverage Brandwise Subcategory level elasticity, Cross-price elasticity, volume share vs profit to understand how to best optimize value and volume share by tweaking price. Compare various scenarios and choose the best price change to get the desired result.'
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 8,
                                                    name: '	Channel Shelf Price Tracker',
                                                    link: 'https://nuclios.mathco.com/app/1692',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Simulate using the price tracker to create an optimum plan'
                                                        }
                                                    ],
                                                    salesForce: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'of price change and approve if within guidelines',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Director- Finance',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 4,
                                                    name: 'Price Simulation And Optimization',
                                                    link: 'https://nuclios.mathco.com/app/1236/price-simulation/scenario-comparison',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Perform Price Point Optimization. Leverage Brandwise Subcategory level elasticity, Cross-price elasticity, volume share vs profit to understand how to best optimize value and volume share by tweaking price. Compare various scenarios and choose the best price change to get the desired result.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '5',
                                        position: { x: 1320, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '5',
                                            heading: 'Rollout',
                                            description:
                                                'for channels with most impact and assess effectiveness before global rollout',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Regional Sales Head',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 5,
                                                    name: 'Price Simulation And Optimization',
                                                    link: 'https://nuclios.mathco.com/app/1236/price-simulation/scenario-comparison',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Perform Price Point Optimization. Leverage Brandwise Subcategory level elasticity, Cross-price elasticity, volume share vs profit to understand how to best optimize value and volume share by tweaking price. Compare various scenarios and choose the best price change to get the desired result.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-4',
                                        source: '4',
                                        target: '5',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 3,
                                name: 'Measurement',
                                due: 'Jul 6',
                                progress: 10,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'In Store Measurement',
                                        link: 'https://nuclios.mathco.com/app/1455/sales-driver-analysis',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Sales driver analysis of trade terms metrics to identify areas where improvements can be made in order to increase profits and optimize operations.'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Sales Driver Analysis',
                                        link: 'https://nuclios.mathco.com/app/1455/sales-driver-analysis',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Sales driver analysis of trade terms metrics to identify areas where improvements can be made in order to increase profits and optimize operations.'
                                            }
                                        ]
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'effectiveness for affordability, penetration & frequency at channel level',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'Commercial Execution Leader',
                                            showHeader: true
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'by isolating shopper activation and promotion impact on target segments to find impact of price',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Manager = Commercial Execution',
                                            showHeader: true
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'for different market scenarios, elasticities & macroeconomic indicators and finalize optimal plan',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Commercial Execution Leader',
                                            showHeader: true
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'of price change and approve if within guidelines',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 1,
                                                    name: 'In Store Measurement',
                                                    link: 'https://nuclios.mathco.com/app/1455/sales-driver-analysis',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Sales driver analysis of trade terms metrics to identify areas where improvements can be made in order to increase profits and optimize operations.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '5',
                                        position: { x: 1320, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '5',
                                            heading: 'Rollout',
                                            description:
                                                'for channels with most impact and assess effectiveness before global rollout',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            showHeader: true,
                                            solutions: [
                                                {
                                                    id: 2,
                                                    name: 'Sales Driver Analysis',
                                                    link: 'https://nuclios.mathco.com/app/1455/sales-driver-analysis',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Sales driver analysis of trade terms metrics to identify areas where improvements can be made in order to increase profits and optimize operations.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Promotions',
                        process: [
                            {
                                id: 1,
                                name: 'Promotion Planning',
                                due: 'Nov 15',
                                progress: 100,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'Post Promo Evaluation',
                                        link: 'https://nuclios.mathco.com/app/1276',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate impact of Markdown/Promo Price change on Sales.'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Promo Planning',
                                        link: 'https://nuclios.mathco.com/app/1487/slice-creation',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Analyze SKUs and PPGs across country, retailer, category, sub-category, sku and time period for which the promotion is to be run'
                                            }
                                        ]
                                    },
                                    {
                                        id: 3,
                                        name: 'Price Promo calendar',
                                        link: 'https://nuclios.mathco.com/app/1276/promo-calendar',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Plan promotions by running various scenarios and updating the promo calendar after analyzing the ouput of the simulations.'
                                            }
                                        ]
                                    },
                                    {
                                        id: 4,
                                        name: 'Promotion Report',
                                        link: 'https://nuclios.mathco.com/app/1695',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Find Reports on main KPIs for promotion planning'
                                            }
                                        ],
                                        powerBi: true
                                    },
                                    {
                                        id: 5,
                                        name: 'Create promotions',
                                        link: 'https://nuclios.mathco.com/app/1694',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Promotions can be a part of a larger campaign to spread awareness about a new product or can be a part of a targeted objective.'
                                            }
                                        ],
                                        salesForce: true
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Review & identify opportunities to enhance the existing promo events',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'Director - Analytics & Insights',
                                            solutions: [
                                                {
                                                    id: 1,
                                                    name: 'Post Promo Evaluation',
                                                    link: 'https://nuclios.mathco.com/app/1276',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Evaluate impact of Markdown/Promo Price change on Sales.'
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 4,
                                                    name: 'Promotion Report',
                                                    link: 'https://nuclios.mathco.com/app/1695',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Find Reports on main KPIs for promotion planning'
                                                        }
                                                    ],
                                                    powerBi: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Develop and quantify shopper needs, price point perception, trends',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Consumer/ Shopper Marketing Lead'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Prioritize strategic SKUs for custom/ optimized promotions',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Sr. Director RGM',
                                            solutions: [
                                                {
                                                    id: 2,
                                                    name: 'Promo Planning',
                                                    link: 'https://nuclios.mathco.com/app/1487/slice-creation',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Analyze SKUs and PPGs across country, retailer, category, sub-category, sku and time period for which the promotion is to be run'
                                                        },
                                                        {
                                                            id: 5,
                                                            name: 'Create promotions',
                                                            link: 'https://nuclios.mathco.com/app/1694',
                                                            data: [
                                                                {
                                                                    id: 1,
                                                                    name: 'Promotions can be a part of a larger campaign to spread awareness about a new product or can be a part of a targeted objective.'
                                                                }
                                                            ],
                                                            salesForce: true
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Develop promotion calendar which align with forecasts',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Director - TPO/TPM RGM',
                                            solutions: [
                                                {
                                                    id: 3,
                                                    name: 'Price Promo calendar',
                                                    link: 'https://nuclios.mathco.com/app/1276/promo-calendar',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Plan promotions by running various scenarios and updating the promo calendar after analyzing the ouput of the simulations.'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '5',
                                        position: { x: 1320, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '5',
                                            heading: 'Rollout',
                                            description: 'Get financial audit and approval',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'VP RGM'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-4',
                                        source: '4',
                                        target: '5',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: 'Promotion Measurement',
                                due: 'Feb 20',
                                progress: 20,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'Post Promo Evaluation',
                                        link: 'https://nuclios.mathco.com/app/1276/datacheck',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate Price promotion effectiveness of various promo types'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Post Promo Evaluation',
                                        link: 'https://nuclios.mathco.com/app/1276/promo-deep-dive-gross-breakdown',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate Price promotion effectiveness of various promo types'
                                            }
                                        ]
                                    },
                                    {
                                        id: 3,
                                        name: 'Promo Impact Analyzer',
                                        link: 'https://nuclios.mathco.com/app/462/promo-pressure/promo-pressure',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Analyze effectiveness of promoton under different conditions'
                                            }
                                        ]
                                    },
                                    {
                                        id: 4,
                                        name: 'Promo sales decomposition',
                                        link: 'https://nuclios.mathco.com/app/773/deep-dive/store-segment-wise-deep-dive/sales-decomposition',
                                        data: [{ id: 1, name: 'Analyze drivers of promo sales' }]
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Evaluate promotion effectiveness considering affordability, penetration, cannibalization & incrementality',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'Director - Analytics & Insights'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Determine profit pools and evaluate promotion RoI',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Director - TPO/TPM RGM'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Track effectiveness in harsher market conditions & competitor events and flag for anomalies',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Sr. Manager - TPO/TPM RGM'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Evaluate impact of instore activations and new product sell in.',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Manager = Commercial Execution'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 3,
                                name: 'Promotion Optimization',
                                due: 'Jul 6',
                                progress: 10,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'Promotion ROI Analyser',
                                        link: 'https://nuclios.mathco.com/app/512/promotion-analysis/uplift-vs-roi',
                                        data: [{ id: 1, name: 'Assess ROI of promotions' }]
                                    },
                                    {
                                        id: 2,
                                        name: 'Promo Optimization',
                                        link: 'https://nuclios.mathco.com/app/1487/simulate',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Plan promotions by running various scenarios and updating the promo calendar after analyzing the ouput of the simulations.'
                                            }
                                        ]
                                    },
                                    {
                                        id: 3,
                                        name: 'Promo Optimization',
                                        link: 'https://nuclios.mathco.com/app/1487/slice-creation',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Plan promotions by running various scenarios and updating the promo calendar after analyzing the ouput of the simulations.'
                                            }
                                        ]
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Optimize for retailer-brand win-win objectives ',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'Category / Account Heads'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Optimize Cost to run promotions & drive higher trade RoI',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Director - TPO/TPM RGM'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Optimize promotion mechanics, event weeks & co merch',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Sr. Manager - TPO/TPM RGM'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Optimize consumer promotion events for targeted channels',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Director - Consumer/ Shopper Promotions'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 3,
                        name: 'Distribution',
                        process: [
                            {
                                id: 1,
                                name: 'Develop Operating Plan',
                                due: 'Nov 15',
                                progress: 100,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Develop key account yearly strategy to achieve joint goals and objectives',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Design AMPS (Availability/Merchandising/Price/Space) plan by category/ brand',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description: 'Create a customer strategy',
                                            showStakeHolder: true,
                                            step: 'next'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Define the picture of success at channel/outlet level.',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: 'Deliver as per plan',
                                due: 'Nov 15',
                                progress: 20,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Forecast for requirements considering all factors - incl velocity, market conditions, supply chain complexity',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Decide best route-to-market within channels to reach customers, shoppers',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Identify & assign specific actions required by the salesforce to implement at channel/ outlet level',
                                            showStakeHolder: true,
                                            step: 'next'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                ' Manage storage of finished goods, chilled and ambient and plan for omnichannel distribution',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    },
                                    {
                                        id: '5',
                                        position: { x: 1320, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '5',
                                            heading: 'Rollout',
                                            description: 'Execute right delivery of the product',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-4',
                                        source: '4',
                                        target: '5',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: 'Measure & Optimize',
                                due: 'Nov 15',
                                progress: 10,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Measure KPIs to ensure pervasive distribution ',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Identify gaps in current route-to-market and define workarounds for ensuring availability',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Develop route-to-market priorities including expansion, new channel developments etc',
                                            showStakeHolder: true,
                                            step: 'next'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Update commercial distribution policy for the company',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 4,
                        name: 'Assortment',
                        process: [
                            {
                                id: 4,
                                name: 'Assortment Strategy',
                                due: 'Nov 15',
                                progress: 100,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'BPPC Analysis',
                                        link: 'https://nuclios.mathco.com/app/1483/market-comparison/pack-roles',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Develop OBPPC and determine priorities'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Growth Opportunity hacker',
                                        link: 'https://nuclios.mathco.com/app/557',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Understand opportunity areas across category,  region & customers'
                                            }
                                        ]
                                    },
                                    {
                                        id: 3,
                                        name: 'Growth forecasting & planning',
                                        link: 'https://nuclios.mathco.com/app/470',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Determine the potential for each market & category'
                                            }
                                        ]
                                    },
                                    {
                                        id: 4,
                                        name: 'Range & Mix Planning',
                                        link: 'https://nuclios.mathco.com/app/320',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Know the current mix distribution and evaluate white spaces'
                                            }
                                        ]
                                    },
                                    {
                                        id: 5,
                                        name: 'Shopper Behavior Analyzer',
                                        link: 'https://nuclios.mathco.com/app/1381/switching-matrix',
                                        data: [{ id: 1, name: 'Channel swicthing analysis' }]
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Determine OBPPC priorities – Develop OBPPC and determine priorities.',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'VP RGM'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Create Business Growth Model - Prioritize category growth opportunities and establish aspirational objectives',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Sr. Director RGM'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Prioritize product mix across channels/ customers/ geographies',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Regional/ Category Head'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description: 'Create channel level shopper strategy',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Head - Channel Strategy'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 1,
                                name: 'Annual Assortment Planning',
                                due: 'Nov 15',
                                progress: 100,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'Assortment Planner',
                                        link: 'https://nuclios.mathco.com/app/1381/descriptive-analysis/sku-opportunity',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'SKU level performance across markets & channels'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Assortment Analyzer',
                                        link: 'https://nuclios.mathco.com/app/1381/descriptive-analysis/sku-opportunity',
                                        data: [{ id: 1, name: '' }]
                                    },
                                    {
                                        id: 3,
                                        name: 'Range Review - SKU Performance evaluator',
                                        link: 'https://nuclios.mathco.com/app/466/range-review-scenario-planner/range-review-scenario-planner',
                                        data: [{ id: 1, name: 'Assess different types of SKUs' }]
                                    },
                                    {
                                        id: 4,
                                        name: 'Planogram Design',
                                        link: 'https://nuclios.mathco.com/app/472/planograms/design',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Design channel specific planograms & optimize them for performance'
                                            }
                                        ]
                                    },
                                    {
                                        id: 5,
                                        name: 'Assortment product',
                                        link: 'https://nuclios.mathco.com/app/1693',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Generate a list of SKUs and add to assortment'
                                            }
                                        ],
                                        salesForce: true
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Create SKU list for channel-geo-category (BU generated)',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'Director - Category',
                                            solutions: [
                                                {
                                                    id: 1,
                                                    name: 'Assortment Planner',
                                                    link: 'https://nuclios.mathco.com/app/1381/descriptive-analysis/sku-opportunity',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'SKU level performance across markets & channels'
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 5,
                                                    name: 'Assortment product',
                                                    link: 'https://nuclios.mathco.com/app/1693',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Generate a list of SKUs and add to assortment'
                                                        }
                                                    ],
                                                    salesForce: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Refine SKUs by paramters (incrementality, NSV, margins, supply chain complexity, velocity, …)',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Director - Analytics & Insights',
                                            solutions: [
                                                {
                                                    id: 2,
                                                    name: 'Assortment Analyzer',
                                                    link: 'https://nuclios.mathco.com/app/1381/descriptive-analysis/sku-opportunity',
                                                    data: [{ id: 1, name: '' }]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Flag SKUs that need to be monitored & create a cull list',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Director - Analytics & Insights',
                                            solutions: [
                                                {
                                                    id: 3,
                                                    name: 'Range Review - SKU Performance evaluator',
                                                    link: 'https://nuclios.mathco.com/app/466/range-review-scenario-planner/range-review-scenario-planner',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Assess different types of SKUs'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description: 'Generate final priority list of SKUs',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Sr. Director RGM'
                                        }
                                    },
                                    {
                                        id: '5',
                                        position: { x: 1320, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '5',
                                            heading: 'Rollout',
                                            description:
                                                'Design planogram for final list at desired levels, bound by guidelines',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'Commercial Execution Leader',
                                            solutions: [
                                                {
                                                    id: 4,
                                                    name: 'Planogram Design',
                                                    link: 'https://nuclios.mathco.com/app/472/planograms/design',
                                                    data: [
                                                        {
                                                            id: 1,
                                                            name: 'Design channel specific planograms & optimize them for performance'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-4',
                                        source: '4',
                                        target: '5',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: 'Assortment Optimization',
                                due: 'Nov 15',
                                progress: 20,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'Assortment Overview',
                                        link: 'https://nuclios.mathco.com/app/472/assortment-overview/assortment-summary',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Idenify opportunities, white spaces to optimize assortment'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Range Review',
                                        link: 'https://nuclios.mathco.com/app/466/range-review-scenario-planner/range-review-scenario-planner',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate KPIs and targets to drive category goals'
                                            }
                                        ]
                                    },
                                    {
                                        id: 3,
                                        name: 'Assortment Optimizer',
                                        link: 'https://nuclios.mathco.com/app/540/assortment-optimizer/assortment-overview/product-sku-report',
                                        data: [
                                            { id: 1, name: 'Optimize assortment and deliver plans' }
                                        ]
                                    },
                                    {
                                        id: 4,
                                        name: 'Assortment Review',
                                        link: 'https://nuclios.mathco.com/app/1481/plan-assortment/final-decision/decision-layer',
                                        data: [{ id: 1, name: 'Final plan reviewer' }]
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Optimize assortment at channel-account-geo level',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'Director - Analytics & Insights'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Align with stakeholder on optimized list of assortment plan or facilitate override',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Category Manager'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description: 'Discuss & finalize plan with field teams',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'Category Head'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description: 'Audit and review final assortment plan',
                                            showStakeHolder: true,
                                            step: 'tbd',
                                            stakeHolder: 'National Account Manager'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 3,
                                name: 'Performance Management',
                                due: 'Nov 15',
                                progress: 10,
                                solutions: [
                                    {
                                        id: 1,
                                        name: 'Assortment Overview',
                                        link: 'https://nuclios.mathco.com/app/472/assortment-overview/assortment-summary',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Idenify opportunities, white spaces to optimize assortment'
                                            }
                                        ]
                                    },
                                    {
                                        id: 2,
                                        name: 'Range Review',
                                        link: 'https://nuclios.mathco.com/app/466/range-review-scenario-planner/range-review-scenario-planner',
                                        data: [
                                            {
                                                id: 1,
                                                name: 'Evaluate KPIs and targets to drive category goals'
                                            }
                                        ]
                                    },
                                    {
                                        id: 3,
                                        name: 'Assortment Optimizer',
                                        link: 'https://nuclios.mathco.com/app/540/assortment-optimizer/assortment-overview/product-sku-report',
                                        data: [
                                            { id: 1, name: 'Optimize assortment and deliver plans' }
                                        ]
                                    },
                                    {
                                        id: 4,
                                        name: 'Assortment Review',
                                        link: 'https://nuclios.mathco.com/app/1481/plan-assortment/final-decision/decision-layer',
                                        data: [{ id: 1, name: 'Final plan reviewer' }]
                                    }
                                ],
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Measure KPIs & Develop specific action plan to capture region, channel, account opportunity',
                                            showStakeHolder: true,
                                            step: 'complete',
                                            stakeHolder: 'Director - Analytics & Insights'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Establish process to consistently capture assortment effectiveness',
                                            showStakeHolder: true,
                                            step: 'active',
                                            stakeHolder: 'Senior Direcor - RGM'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Define new ideal state considering segmentation & potential',
                                            showStakeHolder: true,
                                            step: 'next',
                                            stakeHolder: 'VP RGM'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 5,
                        name: 'Trade Terms',
                        process: [
                            {
                                id: 1,
                                name: 'Trade Strategy & Trade terms development',
                                due: 'Nov 15',
                                progress: 100,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Establish compliance on differences between large and small stores',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Establish right collection and payment protocols for goods sold',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Collaborative incentive planning sessions with customers to reward compliance and promote sales',
                                            showStakeHolder: true,
                                            step: 'next'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Streamline order generation to the settlement of the order',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: 'Process monitoring & optimization',
                                due: 'Nov 15',
                                progress: 20,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Enable sales representatives to improve performance with their customers.',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Streamline order generation to the settlement of the order',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Evlauate price decisions at channel level and draft dynamic pricing as required',
                                            showStakeHolder: true,
                                            step: 'next'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Prospecting, Activities necessary to identify and capture new customers and channels within a geography',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 3,
                                name: 'Negotiation & alignment for subsequent contracts',
                                due: 'Nov 15',
                                progress: 10,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Assess gaps and impact of gaps to negotiate with channel partners',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description: 'Establish the trade pricing plan',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 6,
                        name: 'Execution',
                        process: [
                            {
                                id: 1,
                                name: 'Define annual execution strategy',
                                due: 'Nov 15',
                                progress: 100,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                ' Establish Commercial Execution Priorities (Assets, coolers, availability, space, POSM)',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description: ' Establish segmented execution plans',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Define consistency requirements for retail channels',
                                            showStakeHolder: true,
                                            step: 'next'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Draft guidelines for planogram with retailer constraints & data collection from stores',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    },
                                    {
                                        id: '5',
                                        position: { x: 1320, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '5',
                                            heading: 'Rollout',
                                            description: 'Complete visual merchandizing strategy',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-4',
                                        source: '4',
                                        target: '5',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: 'Operationalization',
                                due: 'Nov 15',
                                progress: 20,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Enabling easy procurment for retail channels',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description:
                                                'Ensure front line execution effectiveness - store, incentives, orders, POSM',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Maximize availability, display and communication through visual merchandising fixes',
                                            showStakeHolder: true,
                                            step: 'next'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description: 'Monitor & Track Planogram compliance',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            },
                            {
                                id: 3,
                                name: 'Measurement of effectiveness',
                                due: 'Nov 15',
                                progress: 10,
                                nodes: [
                                    {
                                        id: '1',
                                        position: { x: 0, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '1',
                                            heading: 'Evaluate Sku Price',
                                            description:
                                                'Capture compliance reports & collaborate with stores for improvement',
                                            showStakeHolder: true,
                                            step: 'complete'
                                        }
                                    },
                                    {
                                        id: '2',
                                        position: { x: 330, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '2',
                                            heading: 'Construct Plan',
                                            description: 'Quantify shopper activity insights',
                                            showStakeHolder: true,
                                            step: 'active'
                                        }
                                    },
                                    {
                                        id: '3',
                                        position: { x: 660, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '3',
                                            heading: 'Simulate Prices',
                                            description:
                                                'Activate, track & steward plan of execution',
                                            showStakeHolder: true,
                                            step: 'next'
                                        }
                                    },
                                    {
                                        id: '4',
                                        position: { x: 990, y: 0 },
                                        type: 'customNode',
                                        data: {
                                            order: '4',
                                            heading: 'Audit Impact',
                                            description:
                                                'Revise planogram,  adjust inventory & negotiate trade terms',
                                            showStakeHolder: true,
                                            step: 'tbd'
                                        }
                                    }
                                ],
                                edges: [
                                    {
                                        id: 'e1-1',
                                        source: '1',
                                        target: '2',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-2',
                                        source: '2',
                                        target: '3',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    },
                                    {
                                        id: 'e1-3',
                                        source: '3',
                                        target: '4',
                                        markerEnd: {
                                            type: MarkerType.Arrow,
                                            color: '#220047',
                                            width: 20,
                                            height: 20
                                        },
                                        style: { stroke: '#220047' }
                                    }
                                ]
                            }
                        ]
                    }
                ],
                processDetails: {
                    title: 'Quarterly / Mid-Year Price Review',
                    progress: 40,
                    legends: [
                        { id: 1, color: '#DCF1EA', name: 'Completed' },
                        { id: 2, color: '#478BDB', name: 'In Process' },
                        { id: 3, color: 'transparent', name: 'Next Step' }
                    ],
                    processInfo: [
                        { heading: 'Potential Impact', value: 'NSV $35M' },
                        { heading: 'Estimated Cost', value: '$2.5M' },
                        { heading: 'Owner', value: 'Jane Doe' },
                        {
                            heading: 'Blocker',
                            value: 'Plan isolating shopper activation & prom plan on S&I team'
                        },
                        {
                            heading: 'Action Needed',
                            value: 'Simulate price and share with stakeholders by Oct 18'
                        }
                    ]
                },
                solutions: [
                    {
                        id: 1,
                        name: 'Data Quality Management',
                        data: [
                            { id: 1, name: 'Quality Report' },
                            { id: 2, name: 'Treatment Recommendations' },
                            { id: 3, name: 'Insights on Data Issues' }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Data Quality Management',
                        data: [
                            { id: 1, name: 'Quality Report' },
                            { id: 2, name: 'Treatment Recommendations' },
                            { id: 3, name: 'Insights on Data Issues' }
                        ]
                    },
                    {
                        id: 3,
                        name: 'Data Quality Management',
                        data: [
                            { id: 1, name: 'Quality Report' },
                            { id: 2, name: 'Treatment Recommendations' },
                            { id: 3, name: 'Insights on Data Issues' }
                        ]
                    },
                    {
                        id: 4,
                        name: 'Data Quality Management',
                        data: [
                            { id: 1, name: 'Quality Report' },
                            { id: 2, name: 'Treatment Recommendations' },
                            { id: 3, name: 'Insights on Data Issues' }
                        ]
                    },
                    {
                        id: 5,
                        name: 'Data Quality Management',
                        data: [
                            { id: 1, name: 'Quality Report' },
                            { id: 2, name: 'Treatment Recommendations' },
                            { id: 3, name: 'Insights on Data Issues' }
                        ]
                    },
                    {
                        id: 6,
                        name: 'Data Quality Management',
                        data: [
                            { id: 1, name: 'Quality Report' },
                            { id: 2, name: 'Treatment Recommendations' },
                            { id: 3, name: 'Insights on Data Issues' }
                        ]
                    },
                    {
                        id: 7,
                        name: 'Data Quality Management',
                        data: [
                            { id: 1, name: 'Quality Report' },
                            { id: 2, name: 'Treatment Recommendations' },
                            { id: 3, name: 'Insights on Data Issues' }
                        ]
                    },
                    {
                        id: 8,
                        name: 'Data Quality Management',
                        data: [
                            { id: 1, name: 'Quality Report' },
                            { id: 2, name: 'Treatment Recommendations' },
                            { id: 3, name: 'Insights on Data Issues' }
                        ]
                    }
                ],
                foundation: {
                    drivers: [
                        {
                            id: 1,
                            name: 'Price',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        },
                        {
                            id: 2,
                            name: 'Promotion',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        },
                        {
                            id: 3,
                            name: 'Assortment',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        },
                        {
                            id: 4,
                            name: 'Distribution',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        },
                        {
                            id: 5,
                            name: 'Execution',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        }
                    ],
                    intiatives: [
                        { id: 1, name: 'Over All Data Assets', data: '68' },
                        { id: 2, name: 'Reliased Data Cost Till Date', data: '$1.2M' },
                        {
                            id: 3,
                            name: 'Data Assets',
                            data: [
                                { id: 1, name: 'Utilized', color: '#220047', value: 58 },
                                { id: 2, name: 'Unutilized', color: '#FFA497', value: 10 }
                            ],
                            progress: {
                                data: [
                                    {
                                        values: [58, 10],
                                        labels: [
                                            '176 In Production',
                                            '150 In Development',
                                            '50 In Idle State'
                                        ],
                                        domain: { column: 0 },
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        textposition: 'outside',
                                        hole: 0.8,
                                        type: 'pie',
                                        marker: {
                                            colors: ['#220047', '#FFA497']
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id: 4,
                            name: 'Data Sources',
                            data: [
                                {
                                    id: 1,
                                    name: 'Catalogued Ext Data Source',
                                    color: '#220047',
                                    value: 45
                                },
                                {
                                    id: 2,
                                    name: 'Catalogued Int Data Source',
                                    color: '#FFA497',
                                    value: 23
                                }
                            ],
                            progress: {
                                data: [
                                    {
                                        values: [45, 23],
                                        labels: [
                                            '176 In Production',
                                            '150 In Development',
                                            '50 In Idle State'
                                        ],
                                        domain: { column: 0 },
                                        hoverinfo: 'none',
                                        hole: 0.8,
                                        textposition: 'outside',
                                        textinfo: 'none',
                                        type: 'pie',
                                        marker: {
                                            colors: ['#220047', '#FFA497']
                                        }
                                    }
                                ]
                            }
                        },

                        {
                            id: 5,
                            name: 'Reliased Cost',
                            data: [
                                { id: 1, name: 'Storage', color: '#220047', value: '$800K' },
                                {
                                    id: 2,
                                    name: 'Data Procurement',
                                    color: '#FFA497',
                                    value: '$250K'
                                },
                                { id: 3, name: 'Compute', color: '#2ECDAA', value: '$150K' }
                            ],
                            progress: {
                                data: [
                                    {
                                        values: [50, 30, 20],
                                        labels: ['$150K', '$250K', '$800K'],
                                        domain: { column: 0 },
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        hole: 0.8,
                                        type: 'pie',
                                        textposition: 'outside',
                                        marker: {
                                            colors: ['#220047', '#FFA497', '#2ECDAA']
                                        },
                                        text: 'sss',
                                        annotationHide: true
                                    }
                                ]
                            }
                        },
                        {
                            id: 6,
                            name: 'Quality & Errors',
                            data: [
                                {
                                    id: 1,
                                    name: 'Data With Quality Over 80%',
                                    color: '#220047',
                                    value: 6
                                },
                                { id: 2, name: 'Reported Data Errors', color: '#FFA497', value: 62 }
                            ],
                            progress: {
                                data: [
                                    {
                                        values: [6, 62],
                                        labels: [
                                            '176 In Production',
                                            '150 In Development',
                                            '50 In Idle State'
                                        ],
                                        domain: { column: 0 },
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        textposition: 'outside',
                                        hole: 0.8,
                                        type: 'pie',
                                        marker: {
                                            colors: ['#220047', '#FFA497']
                                        },
                                        text: 'sss'
                                    }
                                ]
                            }
                        }
                    ],
                    insightsData: [
                        {
                            id: 1,
                            content:
                                '3 Datasets procured for pricing have recurring reliability issues',
                            progress: 'Negative',
                            likes: 4,
                            dislikes: 0
                        },
                        {
                            id: 2,
                            content:
                                '15% of data pipelines tagged to pricing have been idle for over 90 days',
                            progress: 'Negative',
                            likes: 4,
                            dislikes: 0
                        },
                        {
                            id: 3,
                            content:
                                '3 Datasets procured for pricing have recurring reliability issues',
                            progress: 'Negative',
                            likes: 4,
                            dislikes: 0
                        },
                        {
                            id: 4,
                            content:
                                '3 Datasets procured for pricing have recurring reliability issues',
                            progress: 'Negative',
                            likes: 4,
                            dislikes: 0
                        },
                        {
                            id: 5,
                            content:
                                '3 Datasets procured for pricing have recurring reliability issues',
                            progress: 'Positive',
                            likes: 4,
                            dislikes: 0
                        }
                    ],
                    processData: {
                        graphs: {
                            graph1: {
                                type: 'plotly',
                                title: 'Quality',
                                data: [
                                    {
                                        x: [
                                            9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48,
                                            51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90,
                                            93, 96, 99, 109
                                        ],
                                        y: [
                                            10, 15, 20, 25, 20, 15, 10, 13, 16, 19, 17, 15, 13, 20,
                                            27, 34, 30, 26, 22, 25, 28, 31, 29, 27, 25, 27, 29, 31,
                                            30, 29, 28, 40
                                        ],
                                        type: 'scatter',
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        fill: 'tozeroy',
                                        marker: {
                                            symbol: 'circle',
                                            size: 0.1,
                                            color: '#220047'
                                        }
                                    }
                                ],
                                shapes: [
                                    {
                                        type: 'line',
                                        x0: 18,
                                        x1: 18,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 9,
                                        x1: 9,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 27,
                                        x1: 27,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 45,
                                        x1: 45,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 36,
                                        x1: 36,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 63,
                                        x1: 63,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 54,
                                        x1: 54,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 72,
                                        x1: 72,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 81,
                                        x1: 81,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 99,
                                        x1: 99,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 90,
                                        x1: 90,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 109,
                                        x1: 109,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: -1.5,
                                        x1: 98,
                                        y0: 0,
                                        y1: 0,
                                        line: {
                                            color: '#FFFFFF70',
                                            width: 1,
                                            dash: 'solid'
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 1,
                                        x1: 102,
                                        y0: 1,
                                        y1: 1,
                                        line: {
                                            color: '#A8AFB850',
                                            width: 1,
                                            dash: 'solid'
                                        }
                                    }
                                ],

                                annotations: [
                                    {
                                        x: 3,
                                        y: -5,
                                        text: 'Jan',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 18,
                                        y: -5,
                                        text: 'Feb',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 36,
                                        y: -5,
                                        text: 'Mar',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 54,
                                        y: -5,
                                        text: 'Apr',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 72,
                                        y: -5,
                                        text: 'May',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 90,
                                        y: -5,
                                        text: 'Jun',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2.5,
                                        y: 1,
                                        text: '0',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 10,
                                        text: '80%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 20,
                                        text: '85%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 30,
                                        text: '90%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 40,
                                        text: '100%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    }
                                ]
                            },
                            graph2: {
                                type: 'plotly',
                                title: 'Overall Cost',
                                label: 'Six Months Average Cost',
                                data: [
                                    {
                                        fill: 'tozeroy',
                                        marker: {
                                            symbol: 'circle',
                                            size: 0.1,
                                            color: '#220047'
                                        },
                                        opacity: '1',
                                        x: [
                                            '01-06-2023',
                                            '02-06-2023',
                                            '03-06-2023',
                                            '04-06-2023',
                                            '05-06-2023',
                                            '06-06-2023',
                                            '07-06-2023',
                                            '09-06-2023'
                                        ],
                                        y: [20, 30, 60, 20, 20, 30, 40, 20],
                                        type: 'scatter',
                                        hoverinfo: 'none',
                                        textinfo: 'none'
                                    }
                                ]
                            },
                            graph3: {
                                title: 'Overall Consumption',
                                data: [
                                    {
                                        values: [58, 10],
                                        labels: [
                                            '176 In Production',
                                            '150 In Development',
                                            '50 In Idle State'
                                        ],
                                        domain: { column: 0 },
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        textposition: 'outside',
                                        hole: 0.8,
                                        type: 'pie',
                                        marker: {
                                            colors: ['#220047', '#FFA497']
                                        },
                                        annotations: [
                                            {
                                                showarrow: false,
                                                text: 68,
                                                x: 10.5,
                                                y: 10.5
                                            }
                                        ]
                                    }
                                ],
                                legends: [
                                    {
                                        text: 'Utilized',
                                        color: '#220047'
                                    },
                                    {
                                        text: 'Unutilized',
                                        color: 'rgb(255, 164, 151)'
                                    }
                                ]
                            }
                        },
                        kpiData: [
                            {
                                title: 'Health Index',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '100'
                            },
                            {
                                title: 'Errors Reported',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '03'
                            },
                            {
                                title: 'Storage Cost',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '$1.2k'
                            },
                            {
                                title: 'API License Cost',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '$8k'
                            },
                            {
                                title: '# Of Data Assets created',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '35'
                            },
                            {
                                title: '# Of Data Assets created',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '03'
                            }
                        ],
                        processList: ['Pricing Strategy', 'Mid Year Review', 'Measurement'],
                        subProcessList: [
                            'Pricing Analyzer',
                            'Price Point Simulator',
                            'Pricing Elasticity'
                        ]
                    },
                    solutions: [
                        {
                            id: 1,
                            name: 'Data Quality Management',
                            data: [
                                { id: 1, name: 'Quality Report' },
                                { id: 2, name: 'Treatment Recommendations' },
                                { id: 3, name: 'Insights on Data Issues' }
                            ]
                        },
                        {
                            id: 2,
                            name: 'Data Observability',
                            data: [
                                { id: 1, name: 'Optimization Algorithm' },
                                { id: 2, name: 'White Space Analysis' },
                                { id: 3, name: 'Driver Analysis with pricing & promo levers' }
                            ]
                        },
                        {
                            id: 3,
                            name: 'Infrastructure Cost Manager',
                            data: [
                                { id: 1, name: 'Cost Overview' },
                                { id: 2, name: 'Budget & Forecast' },
                                { id: 3, name: 'Optimiser & Recommender' }
                            ]
                        }
                    ]
                },
                intelligence: {
                    drivers: [
                        {
                            id: 1,
                            name: 'Price',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        },
                        {
                            id: 2,
                            name: 'Promotion',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        },
                        {
                            id: 3,
                            name: 'Assortment',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        },
                        {
                            id: 4,
                            name: 'Distribution',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        },
                        {
                            id: 5,
                            name: 'Execution',
                            process: [
                                {
                                    id: 1,
                                    name: 'Yearly Strategy-Category Specific',
                                    due: 'Nov 15',
                                    progress: 100
                                },
                                {
                                    id: 2,
                                    name: 'Quaterly/Mid-Year Price Review',
                                    due: 'Nov 15',
                                    progress: 20
                                },
                                { id: 2, name: 'Measurement', due: 'Nov 15', progress: 10 }
                            ]
                        }
                    ],
                    insightsData: [
                        {
                            id: 1,
                            content:
                                'Due to delayed model drift decision, the Price Analyzer model provided inaccurate pricing for 2 weeks.',
                            progress: 'Negative',
                            likes: 4,
                            dislikes: 0
                        },
                        {
                            id: 2,
                            content:
                                'Achieved 97% prediction accuracy after hyper parameter tuning of price optimiser model, Significantly enhanced the precision of pricing.',
                            progress: 'Negative',
                            likes: 4,
                            dislikes: 0
                        },
                        {
                            id: 3,
                            content:
                                '3 Datasets procured for pricing have recurring reliability issues',
                            progress: 'Negative',
                            likes: 4,
                            dislikes: 0
                        },
                        {
                            id: 4,
                            content:
                                '3 Datasets procured for pricing have recurring reliability issues',
                            progress: 'Negative',
                            likes: 4,
                            dislikes: 0
                        },
                        {
                            id: 5,
                            content:
                                '3 Datasets procured for pricing have recurring reliability issues',
                            progress: 'Positive',
                            likes: 4,
                            dislikes: 0
                        }
                    ],
                    intiatives: [
                        {
                            id: 1,
                            name: 'KPI',
                            record: 10,
                            progress: 10,
                            data: [
                                { id: 1, name: 'Calculated KPI', value: '06' },
                                { id: 2, name: 'Anamolies', value: '01' }
                            ]
                        },
                        {
                            id: 2,
                            name: 'Models',
                            record: 10,
                            progress: '1.2k',
                            data: [
                                { id: 1, name: 'In Production', value: '02' },
                                { id: 2, name: 'In Development', value: '0' },
                                { id: 2, name: 'Idle State', value: '0' }
                            ]
                        },
                        {
                            id: 3,
                            name: 'Performance Monitoring',
                            data: [
                                { id: 1, name: 'Maintenance', value: '$20M' },
                                { id: 2, name: 'Compute Resource Utilization', value: '$20K' }
                            ]
                        },
                        {
                            id: 4,
                            name: 'Cost',
                            record: '$180K',
                            data: [
                                { id: 1, name: 'Consumption', value: '$100K' },
                                { id: 2, name: 'Maintenance', value: '$40K' },
                                { id: 3, name: 'Compute Resource Utilization', value: '$40K' }
                            ]
                        }
                    ],

                    solutions: [
                        {
                            id: 1,
                            name: 'KPI Monitoring',
                            data: [
                                { id: 1, name: 'Anomaly Detection' },
                                { id: 2, name: 'Lineage & Dependencies' },
                                { id: 3, name: 'KPI governance' }
                            ]
                        },
                        {
                            id: 2,
                            name: 'Model management',
                            data: [
                                { id: 1, name: 'Experiment Tracking' },
                                { id: 2, name: 'Model Registry' },
                                { id: 3, name: 'Model Versioning' },
                                { id: 4, name: 'Model Serving' }
                            ]
                        },
                        {
                            id: 3,
                            name: 'Model Monitoring',
                            data: [
                                { id: 1, name: 'Drift monitoring' },
                                { id: 2, name: 'Explainability' },
                                { id: 3, name: 'Bias detection' }
                            ]
                        }
                    ],
                    processData: {
                        graphs: {
                            graph1: {
                                type: 'plotly',
                                title: 'Quality',
                                data: [
                                    {
                                        x: [
                                            9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48,
                                            51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90,
                                            100
                                        ],
                                        y: [
                                            10, 15, 20, 25, 20, 15, 10, 14, 18, 22, 18, 14, 20, 26,
                                            32, 38, 32, 26, 29, 32, 35, 32, 29, 32, 35, 38, 35, 32,
                                            42
                                        ],
                                        type: 'scatter',
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        fill: 'tozeroy',
                                        marker: {
                                            symbol: 'circle',
                                            size: 0.1,
                                            color: '#220047'
                                        }
                                    }
                                ],
                                shapes: [
                                    {
                                        type: 'line',
                                        x0: 12,
                                        x1: 12,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 30,
                                        x1: 30,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 48,
                                        x1: 48,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 63,
                                        x1: 63,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 78,
                                        x1: 78,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: -1.5,
                                        x1: 98,
                                        y0: 0,
                                        y1: 0,
                                        line: {
                                            color: '#FFFFFF70',
                                            width: 1,
                                            dash: 'solid'
                                        }
                                    }
                                ],

                                annotations: [
                                    {
                                        x: 3,
                                        y: -5,
                                        text: 'Jan',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 18,
                                        y: -5,
                                        text: 'Feb',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 36,
                                        y: -5,
                                        text: 'Mar',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 54,
                                        y: -5,
                                        text: 'Apr',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 72,
                                        y: -5,
                                        text: 'May',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 90,
                                        y: -5,
                                        text: 'Jun',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2.5,
                                        y: 1,
                                        text: '0',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 10,
                                        text: '80%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 20,
                                        text: '85%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 30,
                                        text: '90%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 40,
                                        text: '100%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    }
                                ]
                            },
                            graph2: {
                                type: 'plotly',
                                title: 'Overall Cost',
                                label: 'Six Months Average Cost',
                                data: [
                                    {
                                        fill: 'tozeroy',
                                        marker: {
                                            symbol: 'circle',
                                            size: 0.1,
                                            color: '#220047'
                                        },
                                        opacity: '1',
                                        x: [
                                            '01-06-2023',
                                            '02-06-2023',
                                            '03-06-2023',
                                            '04-06-2023',
                                            '05-06-2023',
                                            '06-06-2023',
                                            '07-06-2023',
                                            '09-06-2023'
                                        ],
                                        y: [20, 30, 60, 20, 20, 30, 40, 20],
                                        type: 'scatter',
                                        hoverinfo: 'none',
                                        textinfo: 'none'
                                    }
                                ]
                            },
                            graph3: {
                                title: 'Overall Consumption',
                                data: [
                                    {
                                        values: [58, 10],
                                        labels: [
                                            '176 In Production',
                                            '150 In Development',
                                            '50 In Idle State'
                                        ],
                                        domain: { column: 0 },
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        textposition: 'outside',
                                        hole: 0.8,
                                        type: 'pie',
                                        marker: {
                                            colors: ['#220047', '#FFA497']
                                        },
                                        annotations: [
                                            {
                                                showarrow: false,
                                                text: 68,
                                                x: 10.5,
                                                y: 10.5
                                            }
                                        ]
                                    }
                                ],
                                legends: [
                                    {
                                        text: 'Utilized',
                                        color: '#220047'
                                    },
                                    {
                                        text: 'Unutilized',
                                        color: 'rgb(255, 164, 151)'
                                    }
                                ]
                            }
                        },
                        kpiData: [
                            {
                                title: 'Health Index',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '100'
                            },
                            {
                                title: 'Errors Reported',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '03'
                            },
                            {
                                title: 'Storage Cost',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '$1.2k'
                            },
                            {
                                title: 'API License Cost',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '$8k'
                            },
                            {
                                title: '# Of Data Assets created',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '35'
                            },
                            {
                                title: '# Of Data Assets created',
                                period: 'Last Month',
                                date: '1 - 31 July 23',
                                indicator: '03'
                            }
                        ],
                        processList: ['Mid Year Review', 'Pricing Strategy'],
                        subProcessList: [
                            'Pricing Analyzer',
                            'Historical Data',
                            'Simulator Data',
                            'Price Packed Data',
                            'Pricing Optimizer'
                        ]
                    },
                    modelsViewData: {
                        columns: [
                            {
                                id: 'name',
                                name: 'Model Name',
                                type: 'name'
                            },
                            {
                                id: 'service_health',
                                name: 'Service Health',
                                type: 'boolean'
                            },
                            {
                                id: 'drift',
                                name: 'Drift',
                                type: 'boolean'
                            },
                            {
                                id: 'accuracy',
                                name: 'Accuracy',
                                type: 'boolean'
                            },
                            {
                                id: 'activity',
                                name: 'Activity',
                                type: 'plotly'
                            },
                            {
                                id: 'logs',
                                name: 'Logs',
                                type: 'logs'
                            },
                            {
                                id: 'metadata_availability',
                                name: 'Metadata Availability',
                                type: 'metadata_availability'
                            },
                            {
                                id: 'data_update_frequency',
                                name: 'Data Update Frequency',
                                type: 'data_update_frequency'
                            },
                            {
                                id: 'model_update_frequency',
                                name: 'Model Update Frequency',
                                type: 'model_update_frequency'
                            }
                        ],
                        data: [
                            {
                                name: {
                                    name: 'Sales Forecast & Driver Model',
                                    segment: 'Pricing',
                                    service: 'Azure Databricks',
                                    version: 'V1.3'
                                },
                                service_health: true,
                                drift: false,
                                accuracy: true,
                                activity: {
                                    data: [
                                        {
                                            marker: {
                                                symbol: 'circle',
                                                size: 0.1,
                                                color: '#220047'
                                            },
                                            opacity: '1',
                                            x: [
                                                '01-06-2023',
                                                '02-06-2023',
                                                '03-06-2023',
                                                '04-06-2023',
                                                '05-06-2023',
                                                '06-06-2023',
                                                '07-06-2023',
                                                '09-06-2023'
                                            ],
                                            y: [15, 40, 20, 20, 35, 15],
                                            type: 'scatter',
                                            hoverinfo: 'none',
                                            textinfo: 'none'
                                        }
                                    ]
                                },
                                logs: '',
                                metadata_availability: true,
                                data_update_frequency: 'Daily',
                                model_update_frequency: 'Weekly'
                            },
                            {
                                name: {
                                    name: 'Price Elasticity Model',
                                    segment: 'Finance',
                                    service: 'Azure ML',
                                    version: 'V0.6'
                                },
                                service_health: true,
                                drift: false,
                                accuracy: true,
                                activity: {
                                    data: [
                                        {
                                            marker: {
                                                symbol: 'circle',
                                                size: 0.1,
                                                color: '#220047'
                                            },
                                            opacity: '1',
                                            x: [
                                                '01-06-2023',
                                                '02-06-2023',
                                                '03-06-2023',
                                                '04-06-2023',
                                                '05-06-2023',
                                                '06-06-2023',
                                                '07-06-2023',
                                                '09-06-2023'
                                            ],
                                            y: [15, 40, 20, 20, 35, 15],
                                            type: 'scatter',
                                            hoverinfo: 'none',
                                            textinfo: 'none'
                                        }
                                    ]
                                },
                                logs: '',
                                metadata_availability: false,
                                data_update_frequency: 'Daily',
                                model_update_frequency: 'Daily'
                            },
                            {
                                name: {
                                    name: 'Price Optimiser Model',
                                    segment: 'Marketing',
                                    service: 'Azure Databricks',
                                    version: 'V2.0'
                                },
                                service_health: true,
                                drift: false,
                                accuracy: true,
                                activity: {
                                    data: [
                                        {
                                            marker: {
                                                symbol: 'circle',
                                                size: 0.1,
                                                color: '#220047'
                                            },
                                            opacity: '1',
                                            x: [
                                                '01-06-2023',
                                                '02-06-2023',
                                                '03-06-2023',
                                                '04-06-2023',
                                                '05-06-2023',
                                                '06-06-2023',
                                                '07-06-2023',
                                                '09-06-2023'
                                            ],
                                            y: [15, 35, 20, 28, 45, 15],
                                            type: 'scatter',
                                            hoverinfo: 'none',
                                            textinfo: 'none'
                                        }
                                    ]
                                },
                                logs: '',
                                metadata_availability: true,
                                data_update_frequency: 'Quarterly',
                                model_update_frequency: 'Quarterly'
                            }
                        ]
                    },
                    modelsMetadata: {
                        columns: [
                            {
                                id: 'model_id',
                                name: 'Model ID',
                                type: 'text'
                            },
                            {
                                id: 'version',
                                name: 'Version No.',
                                type: 'text'
                            },
                            {
                                id: 'timestamp',
                                name: 'Time Stamp',
                                type: 'text'
                            },
                            {
                                id: 'username',
                                name: 'User',
                                type: 'text'
                            },
                            {
                                id: 'stage',
                                name: 'Stage',
                                type: 'text'
                            },
                            {
                                id: 'description',
                                name: 'Description',
                                type: 'text'
                            },
                            {
                                id: 'dataset',
                                name: 'Training/Valid Dataset',
                                type: 'text'
                            },
                            {
                                id: 'packages',
                                name: 'Packages Used',
                                type: 'text'
                            }
                        ],
                        data: [
                            {
                                model_id: 'Forecast_2',
                                version: 2,
                                timestamp: '08-02-21 22:33',
                                username: 'John Doe',
                                stage: 'Production',
                                description: 'Demand Forecast',
                                dataset: 'Demand_2971',
                                packages: 'pytorch,...'
                            }
                        ]
                    },
                    overViewTabData: {
                        consumptionData: {
                            title: 'Consumption',
                            info: '54% Consumed',
                            graph: {
                                data: [
                                    {
                                        type: 'bar',
                                        x: [20, 14, 23],
                                        y: [
                                            'Unique User Requests  ',
                                            'Served Model Requests',
                                            'Total App Logins            '
                                        ],
                                        orientation: 'h',
                                        marker: {
                                            color: '#220047'
                                        }
                                    }
                                ],
                                layout: {
                                    ticks: 'outside',
                                    tickcolor: 'white',
                                    ticklen: 50
                                }
                            },
                            values: [80, 40, 75]
                        },
                        costData: {
                            title: 'Cost',
                            info: 'Last Updated: 1 Sep 23',
                            graph: {
                                type: 'plotly',
                                title: 'Overall Cost',
                                label: 'Average Cost',
                                data: [
                                    {
                                        fill: 'tozeroy',
                                        marker: {
                                            symbol: 'circle',
                                            size: 0.1,
                                            color: '#220047'
                                        },
                                        opacity: '1',
                                        x: [
                                            '01-06-2023',
                                            '03-06-2023',
                                            '05-06-2023',
                                            '07-06-2023',
                                            '09-06-2023',
                                            '11-06-2023',
                                            '13-06-2023',
                                            '15-06-2023',
                                            '17-06-2023'
                                        ],
                                        y: [10, 30, 16, 24, 20, 50, 36, 45, 40],
                                        type: 'scatter',
                                        hoverinfo: 'none',
                                        textinfo: 'none'
                                    }
                                ]
                            },
                            costDetails: [
                                {
                                    title: 'Integration Cost',
                                    value: '$15K'
                                },
                                {
                                    title: 'Maintenance Cost',
                                    value: '$2M'
                                },
                                {
                                    title: 'Compute Resource Utils',
                                    value: '$20K'
                                }
                            ]
                        },
                        consumptionDetailsData: [
                            {
                                title: 'Total App Logins',
                                info: 'Last Month: 01-31 Aug 23',
                                value: 200
                            },
                            {
                                title: 'Unique User Requests',
                                info: 'Last Month: 01-31 Aug 23',
                                value: 80
                            },
                            {
                                title: 'Served Model Requests',
                                info: 'Last Month: 01-31 Aug 23',
                                value: 170
                            },
                            {
                                title: 'Error Rate',
                                info: 'Last Month: 01-31 Aug 23',
                                value: '2%'
                            }
                        ],
                        riskData: {
                            title: 'Risk Assesment',
                            riskLevel: 75,
                            legendColor: '#2ECDAA',
                            riskScores: [
                                {
                                    title: 'Operational Risk Score',
                                    info: 'Last Month: 01-31 Aug 23',
                                    value: '06'
                                },
                                {
                                    title: 'Financial Risk Score',
                                    info: 'Last Month: 01-31 Aug 23',
                                    value: '06'
                                }
                            ]
                        }
                    },
                    analyticsTabData: {
                        pipelineModelData: {
                            title: 'Total Pipeline Models',
                            info: 'Last Deployed 7 days ago',
                            legends: [
                                {
                                    title: 'Forecasting',
                                    value: '01',
                                    color: '#2ECDAA'
                                },
                                {
                                    title: 'Classification',
                                    value: '02',
                                    color: '#220047'
                                },
                                {
                                    title: 'Optimisation',
                                    value: '01',
                                    color: '#FFA497'
                                },
                                {
                                    title: 'Segmentation',
                                    value: '01',
                                    color: '#DCCFBB'
                                }
                            ],
                            graph: {
                                title: 'Overall Consumption',
                                data: [
                                    {
                                        values: [1, 2, 1, 1],
                                        labels: ['y1', 'y2', 'y3', 'y4'],
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        textposition: 'outside',
                                        hole: 0.8,
                                        type: 'pie',
                                        marker: {
                                            colors: ['#2ECDAA', '#220047', '#FFA497', '#DCCFBB']
                                        },
                                        annotations: [
                                            {
                                                showarrow: false,
                                                text: '05',
                                                x: 0.2,
                                                y: 0.5
                                            }
                                        ]
                                    }
                                ]
                            },
                            driftLatencyDetails: [
                                {
                                    title: 'Drift',
                                    info: 'Last Updated Yesterday',
                                    graph: {
                                        type: 'plotly',
                                        title: 'Overall Cost',
                                        label: 'Time',
                                        verticalLabel: 'Data Distribution',
                                        data: [
                                            {
                                                fill: 'tozeroy',
                                                marker: {
                                                    symbol: 'circle',
                                                    size: 0.1,
                                                    color: '#FB5B66'
                                                },
                                                opacity: '1',
                                                x: [
                                                    '01-06-2023',
                                                    '03-06-2023',
                                                    '05-06-2023',
                                                    '07-06-2023',
                                                    '09-06-2023',
                                                    '11-06-2023',
                                                    '13-06-2023',
                                                    '15-06-2023',
                                                    '17-06-2023'
                                                ],
                                                y: [10, 30, 16, 24, 20, 50, 36, 45, 40],
                                                type: 'scatter',
                                                hoverinfo: 'none',
                                                textinfo: 'none'
                                            },
                                            {
                                                fill: 'tozeroy',
                                                marker: {
                                                    symbol: 'circle',
                                                    size: 0.1,
                                                    color: '#220047'
                                                },
                                                opacity: '1',
                                                x: [
                                                    '01-06-2023',
                                                    '03-06-2023',
                                                    '05-06-2023',
                                                    '07-06-2023',
                                                    '09-06-2023',
                                                    '11-06-2023'
                                                ],
                                                y: [10, 30, 16, 24, 20, 50],
                                                type: 'scatter',
                                                hoverinfo: 'none',
                                                textinfo: 'none'
                                            }
                                        ]
                                    },
                                    details: [
                                        {
                                            title: 'Detection Rate',
                                            value: '5%/Min',
                                            indicator: '2ms'
                                        },
                                        {
                                            title: 'Frequency',
                                            value: '2 Hrs',
                                            indicator: '2ms'
                                        }
                                    ]
                                },
                                {
                                    title: 'Latency',
                                    info: 'Last Updated Yesterday',
                                    graph: {
                                        type: 'plotly',
                                        title: 'Latency',
                                        label: 'Time',
                                        verticalLabel: 'Latency',
                                        data: [
                                            {
                                                fill: 'tozeroy',
                                                marker: {
                                                    symbol: 'circle',
                                                    size: 0.1,
                                                    color: '#220047'
                                                },
                                                opacity: '1',
                                                x: [
                                                    '01-06-2023',
                                                    '03-06-2023',
                                                    '05-06-2023',
                                                    '07-06-2023',
                                                    '09-06-2023',
                                                    '11-06-2023',
                                                    '13-06-2023',
                                                    '15-06-2023',
                                                    '17-06-2023'
                                                ],
                                                y: [10, 30, 16, 24, 20, 50, 36, 45, 40],
                                                type: 'scatter',
                                                hoverinfo: 'none',
                                                textinfo: 'none'
                                            }
                                        ]
                                    },
                                    details: [
                                        {
                                            title: 'Inference Time',
                                            value: '20MS',
                                            indicator: '2ms'
                                        },
                                        {
                                            title: 'Concurrency',
                                            value: '100/S',
                                            indicator: '2ms'
                                        }
                                    ]
                                }
                            ]
                        },
                        accuracyData: {
                            title: 'Accuracy',
                            total: '05',
                            legends: [
                                {
                                    title: 'Pass',
                                    color: '#2ECDAA',
                                    value: '03'
                                },
                                {
                                    title: 'At risk',
                                    color: '#F2BC5C',
                                    value: '01'
                                },
                                {
                                    title: 'Fail',
                                    color: '#FFA497',
                                    value: '01'
                                }
                            ]
                        },
                        anomalies: {
                            title: 'Anomalies & Alerts',
                            graph: {
                                type: 'plotly',
                                title: 'Quality',
                                data: [
                                    {
                                        x: [
                                            9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48,
                                            51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90,
                                            93, 96, 99, 110
                                        ],
                                        y: [
                                            10, 15, 20, 25, 20, 15, 10, 13, 16, 19, 17, 15, 13, 20,
                                            27, 34, 30, 26, 22, 25, 28, 31, 29, 27, 25, 27, 29, 31,
                                            30, 29, 28, 40
                                        ],
                                        type: 'scatter',
                                        hoverinfo: 'none',
                                        textinfo: 'none',
                                        fill: 'tozeroy',
                                        marker: {
                                            symbol: 'circle',
                                            size: 0.1,
                                            color: '#220047'
                                        }
                                    }
                                ],
                                shapes: [
                                    {
                                        type: 'line',
                                        x0: 18,
                                        x1: 18,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 9,
                                        x1: 9,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 27,
                                        x1: 27,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 45,
                                        x1: 45,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 36,
                                        x1: 36,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 63,
                                        x1: 63,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 54,
                                        x1: 54,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 72,
                                        x1: 72,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 81,
                                        x1: 81,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 99,
                                        x1: 99,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 90,
                                        x1: 90,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 109,
                                        x1: 109,
                                        y0: 1,
                                        y1: 45,
                                        line: {
                                            color: '#22004730',
                                            width: 0.5
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: -1.5,
                                        x1: 98,
                                        y0: 0,
                                        y1: 0,
                                        line: {
                                            color: '#FFFFFF70',
                                            width: 1,
                                            dash: 'solid'
                                        }
                                    },
                                    {
                                        type: 'line',
                                        x0: 1,
                                        x1: 102,
                                        y0: 1,
                                        y1: 1,
                                        line: {
                                            color: '#A8AFB850',
                                            width: 1,
                                            dash: 'solid'
                                        }
                                    }
                                ],

                                annotations: [
                                    {
                                        x: 3,
                                        y: -5,
                                        text: 'Jan',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 18,
                                        y: -5,
                                        text: 'Feb',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 36,
                                        y: -5,
                                        text: 'Mar',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 54,
                                        y: -5,
                                        text: 'Apr',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 72,
                                        y: -5,
                                        text: 'May',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: 90,
                                        y: -5,
                                        text: 'Jun',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2.5,
                                        y: 1,
                                        text: '0',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 10,
                                        text: '80%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 20,
                                        text: '85%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 30,
                                        text: '90%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    },
                                    {
                                        x: -2,
                                        y: 40,
                                        text: '100%',
                                        showarrow: false,
                                        font: {
                                            color: '#220047',
                                            size: 12
                                        }
                                    }
                                ]
                            },
                            details: {
                                title: 'Anomalies Detected',
                                value: 27,
                                month: '18 Sep - 24 Sep 23',
                                kpis: [
                                    {
                                        title: 'Alert Volume',
                                        value: '23',
                                        indicator: '2s'
                                    },
                                    {
                                        title: 'Missed Alert',
                                        value: '32',
                                        indicator: '2s'
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        };
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};
