import health from './icons/HealthCare.svg';
import providers from './icons/Providers.svg';
import insurers from './icons/InsurersandPayers.svg';
import trade from './icons/TradeAndDistribution.svg';
import manufactures from './icons/Manufactures.svg';
import integrateddeliverynetworks from './providers/IntegratedDeliveryNetworks.svg';
import Diagnosticslabs from './providers/DiagnosticLabs.svg';
import Hospitals from './providers/Hospitals.svg';
import animalhealth from './manfacuters/AnimalHealth.svg';
import medicaldevices from './manfacuters/MedicalDevices.svg';
import pharmacetuicals from './manfacuters/Pharmaceuticals.svg';
import aesthtics from './manfacuters/Aesthtics.svg';
import RetailPharamcies from './tradechild/RetailPharmacies.svg';
import GroupPurchaseOrganizations from './tradechild/GroupPurchaseOrganizations.svg';
import Distributions from './tradechild/Distributions.svg';
import Medicare from './insures/Medicare.svg';
import Medicaid from './insures/Medicaid.svg';
import Employers from './insures/Employers.svg';
import Pharamacybenefitmanagers from './insures/PharmacyBenefit.svg';
import Commercialplans from './insures/CommercialPlans.svg';

export const category = {
    Manufactures: {
        color: '#F2ADD9',
        'medical device': {},
        'Animal health': {},
        Aesthetics: {},
        Pharamcetuicals: {
            'R & D': {},
            Pharamacovigilance: {},
            'Market Access': {},
            'Patient insights': {},
            'Commercial and mkts': {}
        }
    },
    Providers: {
        color: '#87DDEA',
        'Primary care centers': {},
        'Integrated delivery networks': {},
        Hospitals: {},
        'Diagnostics labs': {}
    },
    'Insures & payers': {
        color: '#F4A36A',
        'Commericila plans': {},
        Medicare: {},
        Medicaid: {},
        'Phramacy benefit managers': {},
        Employees: {}
    },
    'Trade & distribution': {
        color: '#A79AF2',
        'Retail pharamacies': {},
        'Group purchase organizations(GPOS)': {},
        Distribution: {}
    }
};
export const icons = {
    'Health care': health,
    Providers: providers,
    Manufacturers: manufactures,
    'Insures & payers': insurers,
    'Trade & distribution': trade
};
export const childicons = {
    Manufacturers: [animalhealth, pharmacetuicals, medicaldevices, aesthtics],
    Providers: [integrateddeliverynetworks, Diagnosticslabs, Hospitals],
    'Trade & distribution': [RetailPharamcies, GroupPurchaseOrganizations, Distributions],
    'Insures & payers': [Medicare, Medicaid, Employers, Pharamacybenefitmanagers, Commercialplans]
};

export const dataicons = {
    Manufacturers: {
        animalhealth: animalhealth,
        pharmacetuicals: pharmacetuicals,
        medicaldevices: medicaldevices,
        aesthtics: aesthtics
    },
    Providers: {
        integrateddeliverynetworks: integrateddeliverynetworks,
        Diagnosticslabs: Diagnosticslabs,
        Hospitals: Hospitals
    },
    'Trade & distribution': {
        RetailPharamcies: RetailPharamcies,
        GroupPurchaseOrganizations: GroupPurchaseOrganizations,
        Distributions: Distributions
    },
    'Insures & payers': {
        Medicare: Medicare,
        Medicaid: Medicaid,
        Employers: Employers,
        Pharamacybenefitmanagers: Pharamacybenefitmanagers,
        Commercialplans: Commercialplans
    }
};
export const healthCareIcons = {
    Medicare: Medicare,
    Medicaid: Medicaid,
    Employers: Employers,
    'Pharmacy Benefit Managers (PBMs)': Pharamacybenefitmanagers,
    'Commercial Plans': Commercialplans,
    'Retail Pharamcy': RetailPharamcies,
    'Group Purchase Organizations (GPOs)': GroupPurchaseOrganizations,
    Distributions: Distributions,
    'Integrated Delivery Networks (IDNs)': integrateddeliverynetworks,
    'Diagnostic Labs': Diagnosticslabs,
    Hospitals: Hospitals,
    'Animal Health': animalhealth,
    Pharmaceuticals: pharmacetuicals,
    'Medical Devices': medicaldevices,
    Aesthetics: aesthtics,
    'Health care': health,
    Providers: providers,
    Manufacturers: manufactures,
    'Insurers & Payers': insurers,
    'Trade & Distribution': trade
};
