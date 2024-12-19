export const data = [
    { id: 1, name: 'Health care', color: '#68E1BD', parent_id: null },
    { id: 2, name: 'Manufacturers', color: '#FFD6EC', parent_id: 0 },
    { id: 3, name: 'Providers', color: '#7CEAE9', parent_id: 0 },
    { id: 4, name: 'Insures & payers', color: '#FFD9BA', parent_id: 0 },
    { id: 5, name: 'Trade & distribution', color: '#E7D8FF', parent_id: 0 },
    { id: 6, name: 'medicaldevices', parent_id: 2, color: '#F2ADD9' },
    { id: 7, name: 'aesthtics', parent_id: 2, color: '#F2ADD9' },
    { id: 8, name: 'pharmacetuicals', parent_id: 2, color: '#F2ADD9' },
    { id: 9, name: 'animalhealth', parent_id: 2, color: '#F2ADD9' },
    { id: 10, name: 'Commericial mktg', parent_id: 8, color: '#F2ADD9' },
    { id: 11, name: 'Patients insights', parent_id: 8, color: '#F2ADD9' },
    { id: 12, name: 'Market Access', parent_id: 8, color: '#F2ADD9' },
    { id: 13, name: 'R & D', parent_id: 8, color: '#F2ADD9' },
    { id: 14, name: 'Pharmacovigilance & HEOR', parent_id: 8, color: '#F2ADD9' },
    {
        id: 15,
        name: 'Territory & target allocation',
        parent_id: 10,
        color: '#F2ADD9'
    },
    { id: 16, name: 'Field sales performance', parent_id: 10, color: '#F2ADD9' },
    {
        id: 17,
        name: 'Physician targeting optimization',
        parent_id: 10,
        color: '#F2ADD9'
    },
    {
        id: 15,
        name: 'Marketing mix and campaign effectiveness',
        parent_id: 10,
        color: '#F2ADD9'
    },
    {
        id: 16,
        name: 'Patient support program effctiveness',
        parent_id: 11,
        color: '#F2ADD9'
    },
    { id: 17, name: 'OTC', parent_id: 11, color: '#F2ADD9' },
    { id: 18, name: 'Payer segmentation', parent_id: 12, color: '#F2ADD9' },
    { id: 18, name: 'Rebates /recommendation', parent_id: 12, color: '#F2ADD9' },
    {
        id: 19,
        name: 'Contraxct managemnet & analysis',
        parent_id: 12,
        color: '#F2ADD9'
    },
    { id: 20, name: 'Site selection tool', parent_id: 13, color: '#F2ADD9' },
    {
        id: 21,
        name: 'Horizontalscanning application',
        parent_id: 13,
        color: '#F2ADD9'
    },
    {
        id: 22,
        name: 'Market potential assesement',
        parent_id: 13,
        color: '#F2ADD9'
    },
    { id: 23, name: 'AE sourcing & in-take', parent_id: 14, color: '#F2ADD9' },
    { id: 24, name: 'AE Triaging & analysis', parent_id: 14, color: '#F2ADD9' },
    { id: 25, name: 'AE reporting & Archival', parent_id: 14, color: '#F2ADD9' },
    { id: 26, name: 'RWE capabilities', parent_id: 14, color: '#F2ADD9' },
    { id: 27, name: 'Competative intel', parent_id: 6, color: '#F2ADD9' },
    { id: 28, name: 'Player & HCP', parent_id: 6, color: '#F2ADD9' },
    { id: 30, name: 'Hcp segmentation', parent_id: 27, color: '#F2ADD9' },
    { id: 31, name: 'Market level analytics', parent_id: 27, color: '#F2ADD9' },
    { id: 32, name: 'Payer segmentation', parent_id: 28, color: '#F2ADD9' },
    { id: 33, name: 'HPP loyality', parent_id: 28, color: '#F2ADD9' },
    { id: 34, name: 'HPP churn', parent_id: 28, color: '#F2ADD9' },
    { id: 35, name: 'Pet care', parent_id: 9, color: '#F2ADD9' },
    { id: 36, name: 'vet utilization', parent_id: 35, color: '#F2ADD9' },
    { id: 36, name: 'Early disease setection', parent_id: 35, color: '#F2ADD9' },
    { id: 37, name: 'Wearable analysis', parent_id: 35, color: '#F2ADD9' },
    { id: 38, name: 'Pet food analysis', parent_id: 35, color: '#F2ADD9' },
    { id: 39, name: 'Aesthtics', parent_id: 7, color: '#F2ADD9' },
    { id: 40, name: 'Aesthtics', parent_id: 39, color: '#F2ADD9' },
    { id: 41, name: 'Commercialplans', parent_id: 4, color: '#F4A36A' },
    { id: 42, name: 'Member', parent_id: 41, color: '#F4A36A' },
    { id: 43, name: 'Operations', parent_id: 41, color: '#F4A36A' },
    { id: 44, name: 'Clinical', parent_id: 41, color: '#F4A36A' },
    { id: 45, name: 'Rating', parent_id: 41, color: '#F4A36A' },
    { id: 46, name: 'Personalized engagement', parent_id: 42, color: '#F4A36A' },
    {
        id: 47,
        name: 'Customer service analytics',
        parent_id: 42,
        color: '#F4A36A'
    },
    { id: 48, name: 'Churn model', parent_id: 42, color: '#F4A36A' },
    { id: 49, name: 'Cost estimator tool', parent_id: 42, color: '#F4A36A' },
    { id: 50, name: 'Fraud waste & abused', parent_id: 43, color: '#F4A36A' },
    {
        id: 51,
        name: 'Medical costing forecasting',
        parent_id: 43,
        color: '#F4A36A'
    },
    {
        id: 52,
        name: 'Prior auth decision prediction',
        parent_id: 43,
        color: '#F4A36A'
    },
    {
        id: 53,
        name: 'Hosipital re-admisssion prediction',
        parent_id: 44,
        color: '#F4A36A'
    },
    {
        id: 54,
        name: 'Right time care intervention',
        parent_id: 44,
        color: '#F4A36A'
    },
    { id: 55, name: 'Medicare satr anlystics', parent_id: 45, color: '#F4A36A' },
    { id: 56, name: 'HEIDS performance', parent_id: 45, color: '#F4A36A' },
    { id: 57, name: 'Medicare', parent_id: 4, color: '#F4A36A' },
    { id: 58, name: 'Medicare-fucntion', parent_id: 57, color: '#F4A36A' },
    { id: 59, name: 'Medicare-subfucntion', parent_id: 58, color: '#F4A36A' },
    { id: 60, name: 'Medicaid', parent_id: 4, color: '#F4A36A' },
    { id: 61, name: 'Medicaid-fucntion', parent_id: 60, color: '#F4A36A' },
    { id: 62, name: 'Medicaid-subfucntion', parent_id: 61, color: '#F4A36A' },
    {
        id: 63,
        name: 'Pharamacybenefitmanagers',
        parent_id: 4,
        color: '#F4A36A'
    },
    {
        id: 64,
        name: 'Pharamacy benefit managers (PBMs)',
        parent_id: 63,
        color: '#F4A36A'
    },
    {
        id: 65,
        name: 'Pharamacy benefit managers (PBMs)',
        parent_id: 64,
        color: '#F4A36A'
    },
    { id: 66, name: 'Employers', parent_id: 4, color: '#F4A36A' },
    { id: 67, name: 'Employes function', parent_id: 66, color: '#F4A36A' },
    { id: 68, name: 'Employes-subfunction', parent_id: 67, color: '#F4A36A' },
    {
        id: 69,
        name: 'integrateddeliverynetworks',
        parent_id: 3,
        color: '#87DDEA'
    },
    { id: 70, name: 'Disease', parent_id: 69, color: '#87DDEA' },
    {
        id: 71,
        name: 'Chronic disease prediction',
        parent_id: 70,
        color: '#87DDEA'
    },
    { id: 72, name: 'Rare disease prediction', parent_id: 70, color: '#87DDEA' },
    { id: 73, name: 'care continuum', parent_id: 69, color: '#87DDEA' },
    { id: 74, name: 'Right time intervention', parent_id: 73, color: '#87DDEA' },
    {
        id: 74,
        name: 'High risk population identification',
        parent_id: 73,
        color: '#87DDEA'
    },
    { id: 75, name: 'Precison medicine', parent_id: 73, color: '#87DDEA' },
    { id: 76, name: 'Operations', parent_id: 69, color: '#87DDEA' },
    { id: 77, name: 'Call center analytics', parent_id: 76, color: '#87DDEA' },
    {
        id: 78,
        name: 'Providers payers Ops automation ',
        parent_id: 76,
        color: '#87DDEA'
    },
    { id: 79, name: 'Rating', parent_id: 69, color: '#87DDEA' },
    { id: 80, name: 'Medicare star analytics', parent_id: 79, color: '#87DDEA' },
    { id: 81, name: 'HEIDS performance', parent_id: 79, color: '#87DDEA' },
    { id: 82, name: 'Hospitals', parent_id: 3, color: '#87DDEA' },
    { id: 83, name: 'Hospitals function', parent_id: 82, color: '#87DDEA' },
    { id: 84, name: 'Hospitals subfunction', parent_id: 83, color: '#87DDEA' },
    { id: 85, name: 'Diagnosticslabs', parent_id: 3, color: '#87DDEA' },
    {
        id: 86,
        name: 'Diagnostics labs function',
        parent_id: 85,
        color: '#87DDEA'
    },
    {
        id: 87,
        name: 'Diagnostics labs subfunction',
        parent_id: 86,
        color: '#87DDEA'
    },
    { id: 88, name: 'RetailPharamcies', parent_id: 5, color: '#A79AF2' },
    {
        id: 89,
        name: 'Retail Pharamcies function',
        parent_id: 88,
        color: '#A79AF2'
    },
    {
        id: 90,
        name: 'Retail Pharamcies subfunction',
        parent_id: 89,
        color: '#A79AF2'
    },
    {
        id: 91,
        name: 'GroupPurchaseOrganizations',
        parent_id: 5,
        color: '#A79AF2'
    },
    {
        id: 92,
        name: 'Group Purchase Organizations function',
        parent_id: 91,
        color: '#A79AF2'
    },
    {
        id: 93,
        name: 'Group Purchase Organizations subfunction',
        parent_id: 92,
        color: '#A79AF2'
    },
    { id: 94, name: 'Distributions', parent_id: 5, color: '#A79AF2' },
    { id: 95, name: 'Distributions function', parent_id: 94, color: '#A79AF2' },
    { id: 96, name: 'Distributions subfunction', parent_id: 95, color: '#A79AF2' }
];
