import React from 'react';
import { ReactComponent as CPGStrategyPlanningIcon } from 'assets/img/strategy_planning.svg';
import { ReactComponent as CPGConsumerInsightsIcon } from 'assets/img/consumer_insights.svg';
import { ReactComponent as CPGMarketingIcon } from 'assets/img/marketing.svg';
import { ReactComponent as CPGFinanceProcurementIcon } from 'assets/img/finance_procurement.svg';
import { ReactComponent as CPGRevenueManagementIcon } from 'assets/img/revenur_management.svg';
import { ReactComponent as CPGSupplyChainIcon } from 'assets/img/supply_chain.svg';

import { ReactComponent as RetailFinanceProcurementIcon } from 'assets/img/cpg_finance_procurement.svg';
import { ReactComponent as RetailSupplyChainIcon } from 'assets/img/retail_supplychain.svg';
import { ReactComponent as RetailMarketingIcon } from 'assets/img/cpg_marketing.svg';
import { ReactComponent as RetailCustomerInsightsIcon } from 'assets/img/cpg_consumer_insights.svg';
import { ReactComponent as RetailMerchandisingIcon } from 'assets/img/retail_merchandising.svg';
import { ReactComponent as RetailPricingIcon } from 'assets/img/retail_pricing.svg';

import { ReactComponent as InsuranceClaimsIcon } from 'assets/img/insurance_claims.svg';
import { ReactComponent as InsuranceUnderwritingPricingIcon } from 'assets/img/insurance_underwriting_pricing.svg';
import { ReactComponent as InsuranceMarketingCustomerIcon } from 'assets/img/insurance_marketing_customer.svg';
import { ReactComponent as InsuranceDistributionIcon } from 'assets/img/insurance_distribution.svg';

import { ReactComponent as ManufacturingSupplyChainIcon } from 'assets/img/retail_supplychain.svg';
import { ReactComponent as ManufacturingSalesMktgIcon } from 'assets/img/manufacturing_sales.svg';
import { ReactComponent as ManufacturingEngineeringIcon } from 'assets/img/manufacturing_engineering.svg';

import { ReactComponent as AutomotiveProcurementIcon } from 'assets/img/cpg_finance_procurement.svg';
import { ReactComponent as AutomotiveManufacturingIcon } from 'assets/img/automotive_manufacturing.svg';
import { ReactComponent as AutomotiveDealershipIcon } from 'assets/img/automotive_dealership.svg';
import { ReactComponent as AutomotiveSalesMktgIcon } from 'assets/img/automotive_sales_mktg.svg';
import { ReactComponent as AutomotiveSupplyChainIcon } from 'assets/img/retail_supplychain.svg';
import { ReactComponent as AutomotiveServiceIcon } from 'assets/img/automotive_service.svg';

import { ReactComponent as TechnologyResearchDevelopment } from 'assets/img/technology_research_dev.svg';
import { ReactComponent as TechnologyDistributionIcon } from 'assets/img/distribution.svg';
import { ReactComponent as TechnologyCustomerServiceIcon } from 'assets/img/customer_service.svg';
import { ReactComponent as TechnologySalesIcon } from 'assets/img/telecom_sales.svg';
import { ReactComponent as TechnologyRetentionIcon } from 'assets/img/telecom_retention.svg';

import { ReactComponent as PharmaResearchDevelopment } from 'assets/img/pharma_research_drug_dev.svg';
import { ReactComponent as PharmaMarketAccess } from 'assets/img/pharma_marketaccess.svg';
import { ReactComponent as PharmaManufacturing } from 'assets/img/pharma_manufacturing.svg';
import { ReactComponent as PharmaDistribution } from 'assets/img/pharma_distribution.svg';
import { ReactComponent as PharmaMarketing } from 'assets/img/manufacturing_sales.svg';
import { ReactComponent as PharmaPatientInsights } from 'assets/img/pharma_patient_insights.svg';

import { ReactComponent as FashionRetailSalesIcon } from 'assets/img/fashion_retail_sales.svg';
import { ReactComponent as FashionRetailFulfilmentIcon } from 'assets/img/fashion_retail_fulfillment.svg';

const functionSpecs = {
    CPGStrategyPlanningIcon: { color: '#FFE096', icon: <CPGStrategyPlanningIcon /> },
    CPGConsumerInsightsIcon: { color: '#54A0FF', icon: <CPGConsumerInsightsIcon /> },
    CPGMarketingIcon: { color: '#9F7DE1', icon: <CPGMarketingIcon /> },
    CPGFinanceProcurementIcon: { color: '#6DF0C2', icon: <CPGFinanceProcurementIcon /> },
    CPGRevenueManagementIcon: { color: '#FF9FF3', icon: <CPGRevenueManagementIcon /> },
    CPGSupplyChainIcon: { color: '#98C6FF', icon: <CPGSupplyChainIcon /> },

    RetailFinanceProcurementIcon: { color: '#FFE096', icon: <RetailFinanceProcurementIcon /> },
    RetailSupplyChainIcon: { color: '#54A0FF', icon: <RetailSupplyChainIcon /> },
    RetailMarketingIcon: { color: '#9F7DE1', icon: <RetailMarketingIcon /> },
    RetailCustomerInsightsIcon: { color: '#6DF0C2', icon: <RetailCustomerInsightsIcon /> },
    RetailMerchandisingIcon: { color: '#FF9FF3', icon: <RetailMerchandisingIcon /> },
    RetailPricingIcon: { color: '#98C6FF', icon: <RetailPricingIcon /> },

    InsuranceClaimsIcon: { color: '#FFE096', icon: <InsuranceClaimsIcon /> },
    InsuranceUnderwritingPricingIcon: {
        color: '#54A0FF',
        icon: <InsuranceUnderwritingPricingIcon />
    },
    InsuranceMarketingCustomerIcon: { color: '#9F7DE1', icon: <InsuranceMarketingCustomerIcon /> },
    InsuranceDistributionIcon: { color: '#6DF0C2', icon: <InsuranceDistributionIcon /> },

    ManufacturingSupplyChainIcon: { color: '#FFE096', icon: <ManufacturingSupplyChainIcon /> },
    ManufacturingSalesMktgIcon: { color: '#54A0FF', icon: <ManufacturingSalesMktgIcon /> },
    ManufacturingEngineeringIcon: { color: '#9F7DE1', icon: <ManufacturingEngineeringIcon /> },

    AutomotiveProcurementIcon: { color: '#FFE096', icon: <AutomotiveProcurementIcon /> },
    AutomotiveManufacturingIcon: { color: '#54A0FF', icon: <AutomotiveManufacturingIcon /> },
    AutomotiveDealershipIcon: { color: '#9F7DE1', icon: <AutomotiveDealershipIcon /> },
    AutomotiveSalesMktgIcon: { color: '#6DF0C2', icon: <AutomotiveSalesMktgIcon /> },
    AutomotiveSupplyChainIcon: { color: '#FF9FF3', icon: <AutomotiveSupplyChainIcon /> },
    AutomotiveServiceIcon: { color: '#98C6FF', icon: <AutomotiveServiceIcon /> },

    TechnologyResearchDevelopment: { color: '#FFE096', icon: <TechnologyResearchDevelopment /> },
    TechnologyDistributionIcon: { color: '#54A0FF', icon: <TechnologyDistributionIcon /> },
    TechnologyCustomerServiceIcon: { color: '#9F7DE1', icon: <TechnologyCustomerServiceIcon /> },
    TechnologySalesIcon: { color: '#6DF0C2', icon: <TechnologySalesIcon /> },
    TechnologyRetentionIcon: { color: '', icon: <TechnologyRetentionIcon /> },

    PharmaResearchDevelopment: { color: '#FFE096', icon: <PharmaResearchDevelopment /> },
    PharmaMarketAccess: { color: '#54A0FF', icon: <PharmaMarketAccess /> },
    PharmaManufacturing: { color: '#9F7DE1', icon: <PharmaManufacturing /> },
    PharmaDistribution: { color: '#6DF0C2', icon: <PharmaDistribution /> },
    PharmaMarketing: { color: '#FF9FF3', icon: <PharmaMarketing /> },
    PharmaPatientInsights: { color: '#98C6FF', icon: <PharmaPatientInsights /> },

    FashionRetailSalesIcon: { color: '#FFE096', icon: <FashionRetailSalesIcon /> },
    FashionRetailFulfilmentIcon: { color: '#54A0FF', icon: <FashionRetailFulfilmentIcon /> }
};

export default functionSpecs;
