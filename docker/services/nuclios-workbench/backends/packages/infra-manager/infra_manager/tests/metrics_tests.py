import os
from datetime import datetime, timedelta

import pytz
from dotenv import load_dotenv
from infra_manager import initialize
from infra_manager.core.cloud.azure.utils.metrics.metric_params import (  # AzureMetricLabel,
    AggregationType,
    AzureMetricLabel,
    AzureMetricParams,
    Interval,
    Timespan,
)
from infra_manager.core.cloud.azure.utils.metrics.metrics import AzureMetrics

load_dotenv()

if __name__ == "__main__":
    cloud_settings = {
        "AD_CLIENT_ID": os.environ.get("AD_CLIENT_ID"),
        "AD_CLIENT_SECRET": os.environ.get("AD_CLIENT_SECRET"),
        "TENANT_ID": os.environ.get("TENANT_ID"),
        "RESOURCE_GROUP": os.environ.get("RESOURCE_GROUP"),
        "CLUSTER_NAME": os.environ.get("CLUSTER_NAME"),
        "SUBSCRIPTION_ID": os.environ.get("SUBSCRIPTION_ID"),
    }

    # Initialize kube config
    initialize(
        is_cloud=True,
        cloud_provider="azure",
        cloud_settings=cloud_settings,
    )

    end_time = datetime.utcnow().replace(tzinfo=pytz.UTC)
    start_time = end_time - timedelta(hours=5)

    metric_params = AzureMetricParams(
        az_resource_name="aks-codx-llm-cluster",
        # timespan={
        #     "end_time": f"{end_time:%Y-%m-%dT%H:%M:%SZ}",
        #     "start_time": f"{start_time:%Y-%m-%dT%H:%M:%SZ}",
        # },
        timespan=Timespan(
            end_time=f"{end_time:%Y-%m-%dT%H:%M:%SZ}",
            start_time=f"{start_time:%Y-%m-%dT%H:%M:%SZ}",
        ),
        interval={"unit": Interval.HOURS.value, "value": 1},
        aggregation_type=AggregationType.AVERAGE.value,
        filter={"type": "nodepool", "value": "llmpool"},
        metrics=[
            AzureMetricLabel.AKS_Nodepool_cpu_usage.value,
            AzureMetricLabel.AKS_Nodepool_disk_usage.value,
        ],
    )

    azmetrics = AzureMetrics()

    metric_data = azmetrics.get_metrics(metric_params=metric_params)
    print(metric_data)
