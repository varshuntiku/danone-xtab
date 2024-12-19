import runpy

import codex_widget_factory_lite
from codex_widget_factory_lite.visuals.metric import Metric

runpy.run_path(
    path_name="test.py",
    init_globals={"codex_widget_factory_lite": codex_widget_factory_lite},
)

metric_json = Metric(
    metric_value="$ 100k",
    metric_additional_value="20% YoY",
    metric_additional_value_direction="down",
    alt_behavior=False,
).json_string
print(metric_json)
