from enum import Enum
from typing import NamedTuple


class Timespan(NamedTuple):
    start_time: str
    end_time: str


class TimeInterval(NamedTuple):
    unit: str
    value: int


# class AzureMetricLabel(Enum):
#     class AKS(Enum):
#         class Nodepool(Enum):
#             cpu_usage = "node_cpu_usage_percentage"
#             disk_usage = "node_disk_usage_percentage"


class AzureMetricLabel(Enum):
    AKS_Nodepool_cpu_usage = "node_cpu_usage_percentage"
    AKS_Nodepool_disk_usage = "node_disk_usage_percentage"
    AKS_Nodepool_memory_usage = "node_memory_working_set_percentage"


class AzureMetricParams:
    """
    utility class that intializes the metric parameters
    """

    _az_resource_name: str
    _timespan: Timespan
    _interval: TimeInterval
    _metrics: list
    _aggregation_type: str
    _filter: dict

    def validate_filter_param(self, filter):
        """
        validates filter parameters
        """
        if not isinstance(filter, dict) or "type" not in filter or "value" not in filter:
            raise ValueError("Invalid Filter specified")

    def __init__(
        self,
        az_resource_name: str,
        timespan: Timespan,
        interval: TimeInterval,
        metrics: list,
        aggregation_type: str,
        filter: dict = None,
    ):
        # Validate all the parameters
        if not az_resource_name or az_resource_name == "":
            raise ValueError("Resource is required")
        self._az_resource_name = az_resource_name

        if not isinstance(timespan, Timespan) or not timespan.start_time or not timespan.end_time:
            raise ValueError("Invalid Timespan specified or missing start_time and or end_time")
        self._timespan = timespan

        if not isinstance(interval, dict) or "unit" not in interval or "value" not in interval:
            raise ValueError("Invalid Interval specified")
        self._interval = interval

        if not isinstance(metrics, list) or len(metrics) == 0:
            raise ValueError("Invalid metrics type or atleast 1 metric must be specified")
        self._metrics = metrics

        if not aggregation_type or aggregation_type == "":
            raise ValueError("Aggregation type is required")
        self._aggregation_type = aggregation_type

        if filter:
            self.validate_filter_param(filter)
            self._filter = filter

    @property
    def az_resource_name(self):
        return self._az_resource_name

    @az_resource_name.setter
    def az_resource_name(self, value):
        if not value or value == "":
            raise ValueError("Resource is required")
        self._az_resource_name = value

    @property
    def timespan(self):
        return self._timespan

    @timespan.setter
    def timespan(self, value: Timespan):
        if not isinstance(value, dict) or "start_time" not in value or "end_time" not in value:
            raise ValueError("Invalid Timespan specified or missing start_time and or end_time")
        self._timespan = value

    @property
    def interval(self):
        return self._interval

    @interval.setter
    def interval(self, value):
        if not isinstance(value, dict) or "unit" not in value or "value" not in value:
            raise ValueError("Invalid Timespan specified")
        self._interval = value

    @property
    def metrics(self):
        return self._metrics

    @metrics.setter
    def metrics(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise ValueError("Invalid metrics type or atleast 1 metric must be specified")
        self._metrics = value

    @property
    def aggregation_type(self):
        return self._aggregation_type

    @aggregation_type.setter
    def aggregation_type(self, value):
        if not value or value == "":
            raise ValueError("Aggregation type is required")
        self._aggregation_type = value

    @property
    def filter(self):
        return self._filter

    @filter.setter
    def filter(self, value):
        self.validate_filter_param(value)
        self._filter = value


class Interval(Enum):
    HOURS = "H"
    MINUTES = "M"
    SECONDS = "S"


class AggregationType(Enum):
    AVERAGE = "Average"
    TOTAL = "Total"
