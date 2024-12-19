from codex_widget_factory_lite.data_connectors.file_system import (
    get_ingested_data as IngestFromFile,
)
from codex_widget_factory_lite.data_connectors.sql_database import (
    SqlDatabase as IngestFromSQL,
)
from codex_widget_factory_lite.screen_actions.screen_actions_button_generator import (
    ScreenActionButton,
)
from codex_widget_factory_lite.screen_actions.screen_actions_download_link_generator import (
    ScreenActionDownload,
)
from codex_widget_factory_lite.screen_actions.screen_actions_handler import (
    ScreenActionsHandler,
)
from codex_widget_factory_lite.screen_actions.screen_actions_marquee_slider import (
    MarqueeSlider as MarqueeSlider,
)
from codex_widget_factory_lite.screen_actions.screen_actions_text_list_generator import (
    ScreenActionText,
)
from codex_widget_factory_lite.utils.notifications.notification import Notification
from codex_widget_factory_lite.visuals.dynamic_form import DynamicForm as DynamicForm
from codex_widget_factory_lite.visuals.expandable_table import (
    ExpandableTable as VisualExpandableTable,
)
from codex_widget_factory_lite.visuals.filter import Filter as VisualFilter
from codex_widget_factory_lite.visuals.grid_table import GridTable as VisualGridTable
from codex_widget_factory_lite.visuals.insights import Insights as VisualInsights
from codex_widget_factory_lite.visuals.metric import Metric as VisualMetric
from codex_widget_factory_lite.visuals.plotly_graph import (
    PlotlyGraph as VisualPlotlyGraph,
)
from codex_widget_factory_lite.visuals.simple_table import (
    SimpleTable as VisualSimpleTable,
)
from codex_widget_factory_lite.visuals.table_simulator import (
    TableSimulator as TableSimulator,
)
from codex_widget_factory_lite.visuals.typography import Typography as VisualTypography
from codex_widget_factory_lite.visuals.visual_simulator import (
    VisualSimulator as SimulatorInput,
)
from codex_widget_factory_lite.visuals.visual_simulator import (
    VisualSimulator as VisualSimulator,
)
from codex_widget_factory_lite.visuals.white_space_detector import (
    WhiteSpaceDetector as VisualWhiteSpaceDetector,
)

utils = [
    {"name": "Filter", "object": VisualFilter, "types": ["FILTER"], "doc": "filter.md"},
    {"name": "Metric", "object": VisualMetric, "types": ["VISUAL"], "doc": "metric.md"},
    {
        "name": "Plotly Graph",
        "object": VisualPlotlyGraph,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "graph.md",
    },
    {
        "name": "Simple Table",
        "object": VisualSimpleTable,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "simple_table.md",
    },
    {
        "name": "Grid Table",
        "object": VisualGridTable,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "grid_table.md",
    },
    {
        "name": "Expandable Table",
        "object": VisualExpandableTable,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "expandable_table.md",
    },
    {
        "name": "Dynamic Form",
        "object": DynamicForm,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "dynamic_form.md",
    },
    {
        "name": "Text Insights",
        "object": VisualInsights,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "insights.md",
    },
    {
        "name": "File System",
        "object": IngestFromFile,
        "types": ["INGEST"],
        "doc": "ingestion_file_system.md",
    },
    {
        "name": "SQL",
        "object": IngestFromSQL,
        "types": ["INGEST"],
        "doc": "ingestion_sql.md",
    },
    {
        "name": "Custom Action Button",
        "object": ScreenActionButton,
        "types": ["SCREEN_ACTION_GENERATOR"],
        "doc": "screen_actions_button_generator.md",
    },
    {
        "name": "Download Action Button",
        "object": ScreenActionDownload,
        "types": ["SCREEN_ACTION_GENERATOR"],
        "doc": "screen_actions_download_link_generator.md",
    },
    {
        "name": "Text Action",
        "object": ScreenActionText,
        "types": ["SCREEN_ACTION_GENERATOR"],
        "doc": "screen_actions_text_list_generator.md",
    },
    {
        "name": "Screen Action Handler",
        "object": ScreenActionsHandler,
        "types": ["SCREEN_ACTION_HANDLER"],
        "doc": "screen_actions_handler.md",
    },
    {
        "name": "Table Simulator",
        "object": TableSimulator,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "table_simulator.md",
    },
    {
        "name": "Visual Simulator",
        "object": VisualSimulator,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "visual_simulator.md",
    },
    {
        "name": "White Space Detector",
        "object": VisualWhiteSpaceDetector,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "white_space_detector.md",
    },
    {
        "name": "Typography",
        "object": VisualTypography,
        "types": ["VISUAL", "INFORMATION"],
        "doc": "typography.md",
    },
    {
        "name": "Marquee Slider",
        "object": MarqueeSlider,
        "types": ["SCREEN_ACTION_GENERATOR"],
        "doc": "screen_actions_marquee_slider.md",
    },
    {
        "name": "Custom Notifications",
        "object": Notification,
        "types": ["VISUAL", "SCREEN_ACTION_HANDLER"],
        "doc": "custom_notification.md",
    },
    {
        "name": "Simulator Input",
        "object": SimulatorInput,
        "types": [],
        "doc": "simulator_input.md",
    },
    {
        "name": "Analyze",
        "object": VisualSimulator,
        "types": [],
        "doc": "analyze_simulator.md",
    },
    {
        "name": "Compare",
        "object": VisualSimulator,
        "types": [],
        "doc": "compare_scenario.md",
    },
    {
        "name": "Compare Table",
        "object": VisualSimulator,
        "types": [],
        "doc": "compare_scenario_table.md",
    },
    {
        "name": "Widget Filter",
        "object": VisualFilter,
        "types": [],
        "doc": "widget_filters.md",
    },
    {
        "name": "Widget & screen interconnectivity",
        "object": {},
        "types": ["VISUAL", "INFORMATION"],
        "doc": "widget_interconnectivity.md",
    },
    {
        "name": "Tabular simulator",
        "object": VisualSimulator,
        "types": [],
        "doc": "tabular_simulator.md",
    },
]
