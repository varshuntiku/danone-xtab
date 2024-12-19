import urllib.parse

import httpx
from azure.mgmt.monitor import MonitorManagementClient
from infra_manager.core.cloud.azure.credential import AzureClientCredential
from infra_manager.core.cloud.azure.resource_manager_client import AzureResourceManager
from infra_manager.core.cloud.azure.utils.metrics.metric_params import AzureMetricParams
from infra_manager.settings import (
    AZURE_CLOUD_SETTINGS,
    AZURE_MANAGEMENT_TOKEN_SCOPE,
    AZURE_MANAGEMENT_URL,
)


class AzureMetrics:
    token_scope = AZURE_MANAGEMENT_TOKEN_SCOPE
    metrics_base_url = AZURE_MANAGEMENT_URL
    metrics_resource_uri = "/providers/microsoft.Insights/metrics"

    def __init__(self):
        try:
            self.create_monitor_mgmt_client()
        except Exception as e:
            raise Exception(e)

    def create_monitor_mgmt_client(self):
        """
        Create an instance of compute client using the azure client credentials
        """

        # get auth credentials
        client_credential = AzureClientCredential()
        self._credential = client_credential.credential

        # create an instance of compute mgnt client
        self._monitor_client = MonitorManagementClient(self._credential, AZURE_CLOUD_SETTINGS.get("SUBSCRIPTION_ID"))

    @property
    def monitor_client(self):
        return self._monitor_client

    def construct_metric_filters(self, metric_params):
        """
        Generates metric filters
        """
        if metric_params is not None:
            return f"{metric_params.get('type')} eq '{metric_params.get('value')}'"
        else:
            raise ValueError("Invalid filter specified!!")

    def build_metric_request_params(self, metric_params: AzureMetricParams):
        """
        Summary: Generates or constructs the request parameters for the Metrics API

        Description:
        Given the metric details, generates the request/query params for the metrics API

        Args:
            metric_params (AzureMetricParams): Azure metric params

        returns:
            dict: request params
        """

        request_params = {}

        # 1. construct timespan
        request_params["timespan"] = f"{metric_params.timespan.start_time}/{metric_params.timespan.end_time}"

        # 2. construct interval
        request_params["interval"] = f"PT{metric_params.interval.get('value')}{metric_params.interval.get('unit')}"

        # 3. add metric names
        request_params["metricnames"] = f"{','.join(metric_params.metrics)}"

        # 4. add aggregation type
        request_params["aggregation"] = metric_params.aggregation_type

        # 5. construct filter parameter
        if metric_params.filter:
            request_params["$filter"] = self.construct_metric_filters(metric_params.filter)

        # 6. add rollup param
        if metric_params.filter:
            request_params["rollupby"] = metric_params.filter.get("type")

        # 7. add default static request params
        request_params["autoadjusttimegrain"] = True
        request_params["validatedimensions"] = False

        # 8. Add API version
        request_params["api-version"] = "2019-07-01"

        return urllib.parse.urlencode(request_params, safe=":/,$ '", quote_via=urllib.parse.quote)

    def get_metrics(self, metric_params: AzureMetricParams):
        try:
            # Get resource id based on resource name
            rm_client = AzureResourceManager()
            resource_details = rm_client.get_resource_details(AZURE_CLOUD_SETTINGS.get("CLUSTER_NAME"))
            metric_request_params = self.build_metric_request_params(metric_params)
            print("metric Params", metric_request_params)

            # Get metrics via Metric REST API
            # 1. get the access token first
            access_token = self._credential.get_token(self.token_scope).token

            # 2. get metrics via metrics API
            api_response = httpx.get(
                f"{self.metrics_base_url}{resource_details.id}{self.metrics_resource_uri}?{metric_request_params}",
                headers={"Authorization": f"Bearer {access_token}"},
            )

            # 3. get response values
            metric_values = api_response.json()
            if "value" in metric_values:
                metric_values = metric_values["value"]
            else:
                return []
            serialized_metrics = {}
            # group by metric name
            for metric in metric_values:
                # get the time series data
                serialized_metrics[metric["name"]["value"]] = metric["timeseries"][0]["data"]

            return serialized_metrics
        except Exception as e:
            raise Exception(e)
