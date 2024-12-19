import httpx

pricing_url = "https://prices.azure.com/api/retail/prices"


def get_cost_estimates(service_name: str, region: str, sku: str):
    """
    Summary: Returns the cost estimates for a given sku

    Description:
    Returns the cost estimate for hourly and monthly
    for a given sku and the service

    Args:
        service_name (str): Name or type of service
        region (str): Resource Region
        sku (str): SKU name
    """

    if not service_name:
        raise ValueError("Service Name is required")

    if not region:
        raise ValueError("Region is required")

    if not sku:
        raise ValueError("SKU is required")

    try:
        params = {
            "$filter": f"serviceName eq '{service_name}' and armRegionName eq '{region}' and armSkuName eq '{sku}'"
        }

        response = httpx.get(pricing_url, params=params)

        pricing_details = response.json()

        if "Items" not in pricing_details:
            raise ValueError("Pricing estimates are not available")

        if len(pricing_details["Items"]) == 0:
            raise ValueError("Pricing estimates are not available")

        pricing_list = pricing_details["Items"]

        consumption_pricing = next(
            (pricing for pricing in pricing_list if pricing.get("type") == "Consumption"),
            None,
        )

        cost_estimates = []

        # Append hourly costs directly
        cost_estimates.append(
            {
                "price": consumption_pricing["retailPrice"],
                "unit_of_measure": consumption_pricing["unitOfMeasure"],
            }
        )

        # Append monthly costs
        cost_estimates.append(
            {
                "price": consumption_pricing["retailPrice"] * 24 * 30,
                "unit_of_measure": "Monthly",
            }
        )

        return cost_estimates

    except Exception as e:
        raise Exception(e)
